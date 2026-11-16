import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FormValidationErrors,
  SubmissionOutcome,
  SubmissionOutcomeStatus,
  UploadedDocumentMeta,
  VisaApplicationFormData,
} from '../types/visa';
import {
  clampApplicantsCount,
  validateUploadedFile,
  validateVisaApplicationForm,
} from '../utils/validation';
import { submitVisaApplication } from '../services/applicationService';

const INITIAL_FORM_STATE: VisaApplicationFormData = {
  fullName: '',
  phoneNumber: '',
  nationality: 'مصري',
  currentProfession: '',
  expectedTravelDate: '',
  applicantsCount: 1,
  passportDocument: null,
  personalPhoto: null,
  bankStatementStatus: '',
  explanatoryNotes: '',
  dataUsageConsent: false,
};

export function useApplicationForm() {
  const [formData, setFormData] = useState<VisaApplicationFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [outcome, setOutcome] = useState<SubmissionOutcome>({
    status: SubmissionOutcomeStatus.IDLE,
    message: '',
  });
  const isSubmittingRef = useRef(false);
  const activeObjectUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const urls = activeObjectUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  const updateField = useCallback(
    <K extends keyof VisaApplicationFormData>(field: K, value: VisaApplicationFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
      if (outcome.status !== SubmissionOutcomeStatus.IDLE) {
        setOutcome({ status: SubmissionOutcomeStatus.IDLE, message: '' });
      }
    },
    [outcome.status]
  );

  const incrementApplicants = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      applicantsCount: clampApplicantsCount(prev.applicantsCount + 1),
    }));
  }, []);

  const decrementApplicants = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      applicantsCount: clampApplicantsCount(prev.applicantsCount - 1),
    }));
  }, []);

  const handleFileSelect = useCallback(
    (field: 'passportDocument' | 'personalPhoto', file: File | null) => {
      const docType = field === 'passportDocument' ? 'passport' : 'personal_photo';

      if (!file) {
        setFormData((prev) => {
          const existing = prev[field];
          if (existing?.previewUrl) {
            URL.revokeObjectURL(existing.previewUrl);
            activeObjectUrlsRef.current.delete(existing.previewUrl);
          }
          return { ...prev, [field]: null };
        });
        return;
      }

      const validation = validateUploadedFile(
        { name: file.name, size: file.size, type: file.type },
        docType
      );

      if (!validation.valid) {
        setErrors((prev) => ({
          ...prev,
          [field]: validation.errorMessage,
        }));
        return;
      }

      const isImage = file.type.startsWith('image/');
      const previewUrl = isImage ? URL.createObjectURL(file) : null;
      if (previewUrl) {
        activeObjectUrlsRef.current.add(previewUrl);
      }

      const uploadedMeta: UploadedDocumentMeta = {
        file,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        previewUrl,
      };

      setFormData((prev) => {
        const existing = prev[field];
        if (existing?.previewUrl) {
          URL.revokeObjectURL(existing.previewUrl);
          activeObjectUrlsRef.current.delete(existing.previewUrl);
        }
        return { ...prev, [field]: uploadedMeta };
      });

      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const validateStepFields = useCallback(
    (fields: (keyof VisaApplicationFormData)[]): boolean => {
      const allErrors = validateVisaApplicationForm(formData);
      const stepErrors: FormValidationErrors = {};

      for (const field of fields) {
        if (allErrors[field]) {
          stepErrors[field] = allErrors[field];
        }
      }

      setErrors((prev) => {
        const next = { ...prev };
        for (const field of fields) {
          if (stepErrors[field]) {
            next[field] = stepErrors[field];
          } else {
            delete next[field];
          }
        }
        return next;
      });

      return Object.keys(stepErrors).length === 0;
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // Prevent duplicate submission
      if (isSubmittingRef.current || outcome.status === SubmissionOutcomeStatus.SUBMITTING) {
        return;
      }

      const validationErrors = validateVisaApplicationForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      isSubmittingRef.current = true;
      setErrors({});
      setOutcome({
        status: SubmissionOutcomeStatus.SUBMITTING,
        message: 'جاري التحقق من البيانات والمستندات...',
      });

      try {
        const submissionResult = await submitVisaApplication(formData);
        setOutcome(submissionResult);
      } finally {
        isSubmittingRef.current = false;
      }
    },
    [formData, outcome.status]
  );

  const resetForm = useCallback(() => {
    activeObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    activeObjectUrlsRef.current.clear();
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setOutcome({ status: SubmissionOutcomeStatus.IDLE, message: '' });
  }, []);

  return {
    formData,
    errors,
    outcome,
    isSubmitting: outcome.status === SubmissionOutcomeStatus.SUBMITTING,
    updateField,
    incrementApplicants,
    decrementApplicants,
    handleFileSelect,
    validateStepFields,
    handleSubmit,
    resetForm,
  };
}
