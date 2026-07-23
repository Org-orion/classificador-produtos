export function parsePtNumber(text: string) {
  const cleaned = text.trim();
  if (!cleaned) return null;
  const normalized = cleaned.replace(',', '.');
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? n : null;
}

export function normalizePtNumberText(text: string) {
  const n = parsePtNumber(text);
  if (n === null) return null;
  return Number.isInteger(n) ? String(n) : String(n);
}

export function formatPtNumber(n: number | null | undefined) {
  if (n === null || n === undefined) return '';
  return String(n).replace('.', ',');
}

