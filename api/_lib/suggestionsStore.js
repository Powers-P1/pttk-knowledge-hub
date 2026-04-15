import { kv } from '@vercel/kv';

const STORE_KEY = 'pttk:suggestions:v1';
const fallbackMemory = [];

function hasKvConfig() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function listSuggestions() {
  if (!hasKvConfig()) return [...fallbackMemory];
  const items = await kv.get(STORE_KEY);
  return Array.isArray(items) ? items : [];
}

export async function saveSuggestions(records) {
  if (!hasKvConfig()) {
    fallbackMemory.length = 0;
    fallbackMemory.push(...records);
    return;
  }
  await kv.set(STORE_KEY, records);
}

export async function createSuggestion(input) {
  const next = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    decision: 'pending',
    ...input,
  };

  const all = await listSuggestions();
  all.unshift(next);
  await saveSuggestions(all);
  return next;
}

export async function updateSuggestionDecision(id, decision, adminNote) {
  const all = await listSuggestions();
  const idx = all.findIndex(s => s.id === id);
  if (idx < 0) return null;

  const updated = {
    ...all[idx],
    decision,
    adminNote: adminNote || undefined,
    decidedAt: new Date().toISOString(),
  };

  all[idx] = updated;
  await saveSuggestions(all);
  return updated;
}

export async function deleteSuggestion(id) {
  const all = await listSuggestions();
  const next = all.filter(s => s.id !== id);
  const removed = next.length !== all.length;
  if (removed) {
    await saveSuggestions(next);
  }
  return removed;
}
