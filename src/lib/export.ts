export function downloadCsv(filename: string, rows: string[][]): void {
  const csv = rows
    .map(row => row.map(escapeCsv).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printCurrentPage(): void {
  window.print();
}

function escapeCsv(value: string): string {
  const normalized = value.replace(/\r?\n|\r/g, ' ').trim();
  if (normalized.includes(',') || normalized.includes('"')) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}
