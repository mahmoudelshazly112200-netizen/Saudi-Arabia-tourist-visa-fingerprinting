import 'dotenv/config';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number.parseInt(process.env.PORT || '3000', 10) || 3000;
const PRICE_PER_PERSON_EGP = 9500;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const AUTHORIZED_SUPER_ADMIN_EMAIL = 'nashkatourism@gmail.com';
const GOOGLE_SECURETOKEN_JWK_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

function loadFirebaseProjectId(): string {
  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8')) as {
        projectId?: string;
      };
      if (parsed.projectId) return parsed.projectId;
    }
  } catch {
    // Fallback if config unreadable
  }
  return '';
}

const FIREBASE_PROJECT_ID = loadFirebaseProjectId();

interface GoogleJwkKey extends crypto.JsonWebKey {
  kid?: string;
}

let cachedJwks: { keys: GoogleJwkKey[]; expiresAtMs: number } | null = null;

async function getGoogleSecureTokenJwks(forceRefresh = false): Promise<GoogleJwkKey[]> {
  if (!forceRefresh && cachedJwks && Date.now() < cachedJwks.expiresAtMs) {
    return cachedJwks.keys;
  }

  const response = await fetch(GOOGLE_SECURETOKEN_JWK_URL);
  if (!response.ok) {
    throw new Error('Unable to fetch Google SecureToken public keys');
  }
  const body = (await response.json()) as { keys?: GoogleJwkKey[] };
  const keys = Array.isArray(body.keys) ? body.keys : [];
  cachedJwks = {
    keys,
    expiresAtMs: Date.now() + 60 * 60 * 1000,
  };
  return keys;
}

async function verifyFirebaseAdminIdToken(idToken: string): Promise<boolean> {
  if (!FIREBASE_PROJECT_ID) return false;
  const parts = idToken.split('.');
  if (parts.length !== 3) return false;

  const [headerB64, payloadB64, signatureB64] = parts;
  let header: { alg?: string; kid?: string };
  let payload: {
    aud?: string;
    iss?: string;
    sub?: string;
    exp?: number;
    iat?: number;
    email?: string;
    email_verified?: boolean;
  };

  try {
    header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf-8'));
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
  } catch {
    return false;
  }

  if (header.alg !== 'RS256' || !header.kid) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  if (
    payload.aud !== FIREBASE_PROJECT_ID ||
    payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}` ||
    !payload.sub ||
    typeof payload.exp !== 'number' ||
    payload.exp <= nowSec ||
    typeof payload.iat !== 'number' ||
    payload.iat > nowSec + 300 ||
    payload.email_verified !== true ||
    String(payload.email || '').trim().toLowerCase() !== AUTHORIZED_SUPER_ADMIN_EMAIL
  ) {
    return false;
  }

  let keys = await getGoogleSecureTokenJwks(false);
  let matchingJwk = keys.find((k) => k.kid === header.kid);
  if (!matchingJwk) {
    keys = await getGoogleSecureTokenJwks(true);
    matchingJwk = keys.find((k) => k.kid === header.kid);
  }
  if (!matchingJwk) return false;

  try {
    const publicKey = crypto.createPublicKey({
      key: matchingJwk,
      format: 'jwk',
    });
    return crypto.verify(
      'RSA-SHA256',
      Buffer.from(`${headerB64}.${payloadB64}`),
      publicKey,
      Buffer.from(signatureB64, 'base64url')
    );
  } catch {
    return false;
  }
}

const ALLOWED_PASSPORT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);
const ALLOWED_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const VALID_BANK_STATUSES = new Set([
  'available_if_requested',
  'not_available_currently',
  'need_consultation',
]);
const VALID_APP_STATUSES = new Set([
  'new_submission',
  'documents_under_review',
  'additional_info_needed',
  'ready_for_processing',
  'visa_issued',
  'rejected',
]);
const VALID_DOC_STATUSES = new Set([
  'pending',
  'approved',
  'replacement_required',
]);

const SAFE_STORED_FILENAME_REGEX = /^[0-9]+-[0-9a-f-]+\.(jpg|jpeg|png|webp|pdf|bin)$/i;

const DATA_DIR = path.join(process.cwd(), '.data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const APPLICATIONS_DB_PATH = path.join(DATA_DIR, 'applications.json');

function ensureStorageReady(): void {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(APPLICATIONS_DB_PATH)) {
    fs.writeFileSync(APPLICATIONS_DB_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

interface StoredDocumentItem {
  id: string;
  type: 'passport' | 'personal_photo';
  labelAr: string;
  fileName: string;
  storedFileName: string;
  fileSizeBytes: number;
  mimeType: string;
  verificationStatus: string;
}

interface StoredApplicationRecord {
  id: string;
  referenceId: string;
  customerId: string;
  fullName: string;
  phoneNumber: string;
  nationality: string;
  currentProfession: string;
  expectedTravelDate: string;
  applicantsCount: number;
  totalAmountEgp: number;
  bankStatementStatus: string;
  explanatoryNotes: string;
  status: string;
  documents: StoredDocumentItem[];
  createdAt: string;
  source: 'backend_persisted';
}

function readApplications(): StoredApplicationRecord[] {
  ensureStorageReady();
  try {
    const raw = fs.readFileSync(APPLICATIONS_DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeApplications(records: StoredApplicationRecord[]): void {
  ensureStorageReady();
  const tempPath = `${APPLICATIONS_DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(records, null, 2), 'utf-8');
  fs.renameSync(tempPath, APPLICATIONS_DB_PATH);
}

function normalizeDigits(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

function isValidFutureOrTodayIsoDate(dateStr: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return false;

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);

  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    return false;
  }

  const minAllowedMs = Date.now() - 36 * 60 * 60 * 1000;
  const maxAllowedMs = Date.now() + 365 * 5 * 24 * 60 * 60 * 1000;
  return candidate.getTime() >= minAllowedMs && candidate.getTime() <= maxAllowedMs;
}

function verifyFileMagicBytes(filePath: string, expectedMime: string): boolean {
  try {
    const fd = fs.openSync(filePath, 'r');
    const header = Buffer.alloc(12);
    const bytesRead = fs.readSync(fd, header, 0, 12, 0);
    fs.closeSync(fd);

    if (bytesRead < 4) return false;

    if (expectedMime === 'image/jpeg') {
      return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    }
    if (expectedMime === 'image/png') {
      return (
        bytesRead >= 8 &&
        header[0] === 0x89 &&
        header[1] === 0x50 &&
        header[2] === 0x4e &&
        header[3] === 0x47 &&
        header[4] === 0x0d &&
        header[5] === 0x0a &&
        header[6] === 0x1a &&
        header[7] === 0x0a
      );
    }
    if (expectedMime === 'image/webp') {
      return (
        bytesRead >= 12 &&
        header.subarray(0, 4).toString('ascii') === 'RIFF' &&
        header.subarray(8, 12).toString('ascii') === 'WEBP'
      );
    }
    if (expectedMime === 'application/pdf') {
      return bytesRead >= 5 && header.subarray(0, 5).toString('ascii') === '%PDF-';
    }
    return false;
  } catch {
    return false;
  }
}

function createRateLimiter(maxRequests: number, windowMs: number) {
  const hits = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const recent = (hits.get(clientIp) || []).filter((ts) => now - ts < windowMs);

    if (recent.length >= maxRequests) {
      res.status(429).json({
        ok: false,
        error: 'تم تجاوز الحد المسموح للطلبات المتتالية، يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.',
      });
      return;
    }

    recent.push(now);
    hits.set(clientIp, recent);

    if (hits.size > 1000) {
      for (const [ip, timestamps] of hits.entries()) {
        if (timestamps.every((ts) => now - ts >= windowMs)) {
          hits.delete(ip);
        }
      }
    }

    next();
  };
}

function generateUniqueReferenceId(existing: StoredApplicationRecord[]): string {
  const existingIds = new Set(existing.map((r) => r.referenceId));
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 20; attempt++) {
    const num = crypto.randomInt(100000, 999999);
    const candidate = `NSK-${year}-${num}`;
    if (!existingIds.has(candidate)) {
      return candidate;
    }
  }
  return `NSK-${year}-${Date.now().toString().slice(-6)}`;
}

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureStorageReady();
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const safeExt =
      MIME_TO_EXT[file.mimetype] ||
      path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '') ||
      '.bin';
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${safeExt}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 2,
    fields: 15,
    fieldSize: 16 * 1024,
  },
});

function cleanupUploadedFiles(filesDict: Record<string, Express.Multer.File[]> | undefined): void {
  if (!filesDict) return;
  for (const list of Object.values(filesDict)) {
    for (const f of list) {
      try {
        if (f.path && fs.existsSync(f.path)) {
          fs.unlinkSync(f.path);
        }
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}

async function requireVerifiedAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = String(req.headers.authorization || '');
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const configuredStaticToken = (process.env.ADMIN_ACCESS_TOKEN || '').trim();
  const headerToken = String(req.headers['x-admin-token'] || '').trim();

  if (
    configuredStaticToken &&
    ((bearerToken && bearerToken === configuredStaticToken) ||
      (headerToken && headerToken === configuredStaticToken))
  ) {
    next();
    return;
  }

  if (!bearerToken) {
    res.status(401).json({
      ok: false,
      error: 'غير مصرح بالوصول إلى مسارات الإدارة دون تسجيل الدخول بحساب الإدارة المعتمد.',
    });
    return;
  }

  const verified = await verifyFirebaseAdminIdToken(bearerToken);
  if (!verified) {
    res.status(403).json({
      ok: false,
      error: 'غير مصرح لهذا الحساب بالوصول إلى بيانات الإدارة.',
    });
    return;
  }

  next();
}

async function startServer(): Promise<void> {
  ensureStorageReady();
  const app = express();
  app.disable('x-powered-by');

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (
      req.path === '/admin' ||
      req.path.startsWith('/admin/') ||
      req.path === '/track' ||
      req.path.startsWith('/api/admin')
    ) {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }
    next();
  });

  app.use(express.json({ limit: '64kb' }));

  const submitRateLimit = createRateLimiter(20, 15 * 60 * 1000);
  const trackRateLimit = createRateLimiter(60, 15 * 60 * 1000);

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      persistence: 'cloud_firestore_and_local_uploads',
      firebaseProjectConfigured: Boolean(FIREBASE_PROJECT_ID),
      adminAuthEnforced: true,
    });
  });

  app.post(
    '/api/applications',
    submitRateLimit,
    (req, res, next) => {
      const uploader = upload.fields([
        { name: 'passportDocument', maxCount: 1 },
        { name: 'personalPhoto', maxCount: 1 },
      ]);
      uploader(req, res, (err) => {
        if (err) {
          res.status(400).json({
            ok: false,
            error: 'تعذر رفع الملفات. تأكد من أن حجم كل ملف لا يتجاوز 10 ميجابايت.',
          });
          return;
        }
        next();
      });
    },
    (req, res) => {
      const filesDict = req.files as Record<string, Express.Multer.File[]> | undefined;
      const passportFile = filesDict?.passportDocument?.[0];
      const photoFile = filesDict?.personalPhoto?.[0];

      const fullName = String(req.body.fullName || '').trim();
      const phoneNumber = String(req.body.phoneNumber || '').trim();
      const nationality = String(req.body.nationality || '').trim();
      const currentProfession = String(req.body.currentProfession || '').trim();
      const expectedTravelDate = String(req.body.expectedTravelDate || '').trim();
      const applicantsCount = Number.parseInt(String(req.body.applicantsCount || '1'), 10);
      const bankStatementStatus = String(req.body.bankStatementStatus || '').trim();
      const explanatoryNotes = String(req.body.explanatoryNotes || '').trim();
      const dataUsageConsent = String(req.body.dataUsageConsent || '') === 'true';

      if (
        fullName.length < 5 ||
        fullName.length > 150 ||
        fullName.split(/\s+/).length < 2 ||
        !/^\+?\d{9,15}$/.test(phoneNumber.replace(/[\s\-()]/g, '')) ||
        phoneNumber.length > 20 ||
        !nationality ||
        nationality.length > 80 ||
        currentProfession.length < 2 ||
        currentProfession.length > 120 ||
        explanatoryNotes.length > 2000 ||
        !isValidFutureOrTodayIsoDate(expectedTravelDate) ||
        !Number.isInteger(applicantsCount) ||
        applicantsCount < 1 ||
        applicantsCount > 20 ||
        !VALID_BANK_STATUSES.has(bankStatementStatus) ||
        !dataUsageConsent ||
        !passportFile ||
        !photoFile
      ) {
        cleanupUploadedFiles(filesDict);
        res.status(400).json({
          ok: false,
          error: 'يرجى استكمال كافة البيانات والمستندات المطلوبة بشكل صحيح قبل الإرسال.',
        });
        return;
      }

      if (
        !ALLOWED_PASSPORT_TYPES.has(passportFile.mimetype) ||
        !ALLOWED_PHOTO_TYPES.has(photoFile.mimetype) ||
        !verifyFileMagicBytes(passportFile.path, passportFile.mimetype) ||
        !verifyFileMagicBytes(photoFile.path, photoFile.mimetype)
      ) {
        cleanupUploadedFiles(filesDict);
        res.status(400).json({
          ok: false,
          error: 'صيغة أحد الملفات المرفوعة غير مدعومة أو الملف تالف، يرجى رفع صورة أو ملف PDF صالح.',
        });
        return;
      }

      const existingRecords = readApplications();
      const referenceId = generateUniqueReferenceId(existingRecords);
      const nowIso = new Date().toISOString();
      const totalAmountEgp = applicantsCount * PRICE_PER_PERSON_EGP;
      const recordUuid = crypto.randomUUID();

      const newRecord: StoredApplicationRecord = {
        id: recordUuid,
        referenceId,
        customerId: `CUST-${referenceId}`,
        fullName,
        phoneNumber,
        nationality,
        currentProfession,
        expectedTravelDate,
        applicantsCount,
        totalAmountEgp,
        bankStatementStatus,
        explanatoryNotes,
        status: 'new_submission',
        createdAt: nowIso,
        source: 'backend_persisted',
        documents: [
          {
            id: `DOC-PASS-${recordUuid.slice(0, 8)}`,
            type: 'passport',
            labelAr: 'صورة جواز السفر',
            fileName: path.basename(passportFile.originalname).slice(0, 140),
            storedFileName: passportFile.filename,
            fileSizeBytes: passportFile.size,
            mimeType: passportFile.mimetype,
            verificationStatus: 'pending',
          },
          {
            id: `DOC-PHOTO-${recordUuid.slice(0, 8)}`,
            type: 'personal_photo',
            labelAr: 'صورة شخصية',
            fileName: path.basename(photoFile.originalname).slice(0, 140),
            storedFileName: photoFile.filename,
            fileSizeBytes: photoFile.size,
            mimeType: photoFile.mimetype,
            verificationStatus: 'pending',
          },
        ],
      };

      writeApplications([newRecord, ...existingRecords]);

      res.status(201).json({
        ok: true,
        referenceId: newRecord.referenceId,
        createdAt: newRecord.createdAt,
        totalAmountEgp: newRecord.totalAmountEgp,
        application: newRecord,
      });
    }
  );

  app.get('/api/applications/track', trackRateLimit, (req, res) => {
    const referenceId = String(req.query.referenceId || '').trim().toUpperCase();
    const phone = normalizeDigits(String(req.query.phone || ''));

    if (!referenceId || referenceId.length > 32 || phone.length < 8 || phone.length > 16) {
      res.status(400).json({
        ok: false,
        error: 'يرجى إدخال رقم الطلب المرجعي ورقم الهاتف بشكل صحيح.',
      });
      return;
    }

    const records = readApplications();
    const match = records.find((item) => {
      if (item.referenceId.toUpperCase() !== referenceId) return false;
      const storedDigits = normalizeDigits(item.phoneNumber);
      return storedDigits === phone || storedDigits.endsWith(phone.slice(-9));
    });

    if (!match) {
      res.status(404).json({
        ok: false,
        error: 'لم يتم العثور على طلب مطابق لرقم المرجع ورقم الهاتف المدخلين.',
      });
      return;
    }

    res.json({
      ok: true,
      tracking: {
        referenceId: match.referenceId,
        fullName: match.fullName,
        applicantsCount: match.applicantsCount,
        totalAmountEgp: match.totalAmountEgp,
        expectedTravelDate: match.expectedTravelDate,
        status: match.status,
        createdAt: match.createdAt,
        documents: match.documents.map((d) => ({
          type: d.type,
          labelAr: d.labelAr,
          verificationStatus: d.verificationStatus,
        })),
      },
    });
  });

  app.get('/api/admin/applications', requireVerifiedAdminAuth, (_req, res) => {
    const records = readApplications();
    res.json({
      ok: true,
      applications: records,
    });
  });

  app.patch('/api/admin/applications/:id/status', requireVerifiedAdminAuth, (req, res) => {
    const { id } = req.params;
    const status = String(req.body.status || '');
    if (!VALID_APP_STATUSES.has(status)) {
      res.status(400).json({ ok: false, error: 'حالة الطلب غير صالحة.' });
      return;
    }

    const records = readApplications();
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) {
      res.status(404).json({ ok: false, error: 'الطلب غير موجود.' });
      return;
    }

    records[idx] = { ...records[idx], status };
    writeApplications(records);
    res.json({ ok: true, application: records[idx] });
  });

  app.patch(
    '/api/admin/applications/:id/documents/:docId',
    requireVerifiedAdminAuth,
    (req, res) => {
      const { id, docId } = req.params;
      const verificationStatus = String(req.body.verificationStatus || '');
      if (!VALID_DOC_STATUSES.has(verificationStatus)) {
        res.status(400).json({ ok: false, error: 'حالة المستند غير صالحة.' });
        return;
      }

      const records = readApplications();
      const idx = records.findIndex((r) => r.id === id);
      if (idx === -1) {
        res.status(404).json({ ok: false, error: 'الطلب غير موجود.' });
        return;
      }

      records[idx] = {
        ...records[idx],
        documents: records[idx].documents.map((docItem) =>
          docItem.id === docId ? { ...docItem, verificationStatus } : docItem
        ),
      };
      writeApplications(records);
      res.json({ ok: true, application: records[idx] });
    }
  );

  app.get('/api/admin/documents/:storedFileName', requireVerifiedAdminAuth, (req, res) => {
    const safeName = path.basename(String(req.params.storedFileName || ''));
    if (!safeName || !SAFE_STORED_FILENAME_REGEX.test(safeName)) {
      res.status(400).end();
      return;
    }
    const fullPath = path.join(UPLOADS_DIR, safeName);
    if (!fs.existsSync(fullPath)) {
      res.status(404).end();
      return;
    }
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'none'; img-src 'self' data: blob:; style-src 'unsafe-inline'; sandbox"
    );
    res.setHeader('Cache-Control', 'private, no-store');
    res.sendFile(fullPath);
  });

  app.all('/api/*', (_req, res) => {
    res.status(404).json({
      ok: false,
      error: 'المسار البرمجي المطلوب غير موجود.',
    });
  });

  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err && typeof err === 'object' && 'type' in err && err.type === 'entity.parse.failed') {
      res.status(400).json({
        ok: false,
        error: 'صيغة البيانات المرسلة غير صالحة.',
      });
      return;
    }
    next(err);
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(
      '/assets',
      express.static(path.join(distPath, 'assets'), {
        maxAge: '7d',
        immutable: true,
      })
    );
    app.use(express.static(distPath, { index: false }));
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nashka Visa Platform server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
