function sanitizeCsvCell(rawValue: unknown): string {
  const text = String(rawValue ?? '').replace(/\r?\n|\r/g, ' ');
  const formulaSafe = /^[=+\-@\t]/.test(text) ? `'${text}` : text;
  const escaped = formulaSafe.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function buildUtf8Csv(headers: string[], rows: unknown[][]): string {
  const lines = [
    headers.map(sanitizeCsvCell).join(','),
    ...rows.map((row) => row.map(sanitizeCsvCell).join(',')),
  ];
  return `\uFEFF${lines.join('\r\n')}`;
}

export function triggerCsvDownload(
  filename: string,
  headers: string[],
  rows: unknown[][]
): void {
  const csvContent = buildUtf8Csv(headers, rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
