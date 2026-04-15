import type { SuggestionDecision, SuggestionRecord } from '../types/suggestions';

const STORAGE_KEY = 'pttk_suggestions_v1';

function isSuggestionRecord(value: unknown): value is SuggestionRecord {
  if (!value || typeof value !== 'object') return false;
  const rec = value as Partial<SuggestionRecord>;
  return (
    typeof rec.id === 'string' &&
    typeof rec.createdAt === 'string' &&
    typeof rec.kind === 'string' &&
    typeof rec.title === 'string' &&
    typeof rec.details === 'string' &&
    typeof rec.decision === 'string'
  );
}

export function readSuggestions(): SuggestionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSuggestionRecord).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export function saveSuggestions(records: SuggestionRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function addSuggestion(input: Omit<SuggestionRecord, 'id' | 'createdAt' | 'decision'>): SuggestionRecord {
  const next: SuggestionRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    decision: 'pending',
  };

  const all = readSuggestions();
  all.unshift(next);
  saveSuggestions(all);
  return next;
}

export function setSuggestionDecision(id: string, decision: SuggestionDecision, adminNote?: string) {
  const all = readSuggestions();
  const next = all.map(rec =>
    rec.id === id
      ? {
          ...rec,
          decision,
          adminNote: adminNote?.trim() || undefined,
          decidedAt: new Date().toISOString(),
        }
      : rec
  );
  saveSuggestions(next);
  return next;
}
