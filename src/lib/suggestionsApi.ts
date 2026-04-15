import type { SuggestionDecision, SuggestionRecord } from '../types/suggestions';
import { addSuggestion, readSuggestions, setSuggestionDecision } from './suggestionsStore';
import { getAdminSessionSecret } from './adminAuth';

const IS_LOCALHOST = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);
const ALLOW_LOCAL_FALLBACK = import.meta.env.DEV || IS_LOCALHOST;

export interface NewSuggestionInput {
  kind: SuggestionRecord['kind'];
  title: string;
  details: string;
  sourceUrl?: string;
  contact?: string;
}

function endpoint(path: string) {
  return `/api${path}`;
}

async function safeJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `API error: ${res.status}`;
    try {
      const body = await res.json() as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export async function listSuggestions(): Promise<SuggestionRecord[]> {
  try {
    const adminSecret = getAdminSessionSecret();
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (adminSecret) {
      headers.Authorization = `Bearer ${adminSecret}`;
    }

    const res = await fetch(endpoint('/suggestions'), {
      headers,
    });
    return await safeJson<SuggestionRecord[]>(res);
  } catch {
    if (ALLOW_LOCAL_FALLBACK) return readSuggestions();
    throw new Error('Nie udało się pobrać propozycji z API.');
  }
}

export async function createSuggestion(input: NewSuggestionInput): Promise<SuggestionRecord> {
  try {
    const res = await fetch(endpoint('/suggestions'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(input),
    });
    return await safeJson<SuggestionRecord>(res);
  } catch {
    if (ALLOW_LOCAL_FALLBACK) return addSuggestion(input);
    throw new Error('Nie udało się zapisać propozycji przez API.');
  }
}

export async function decideSuggestion(id: string, decision: SuggestionDecision, adminNote: string): Promise<SuggestionRecord[]> {
  try {
    const adminSecret = getAdminSessionSecret();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (adminSecret) {
      headers.Authorization = `Bearer ${adminSecret}`;
    }

    const res = await fetch(endpoint('/moderate'), {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ id, decision, adminNote: adminNote.trim() || undefined }),
    });
    const updated = await safeJson<SuggestionRecord>(res);
    const all = readSuggestions();
    const next = all.map(s => (s.id === updated.id ? updated : s));
    return next;
  } catch {
    if (ALLOW_LOCAL_FALLBACK) return setSuggestionDecision(id, decision, adminNote);
    throw new Error('Nie udało się zapisać decyzji admina w API.');
  }
}
