import { requireAdmin } from './_lib/auth.js';
import { deleteSuggestion, updateSuggestionDecision } from './_lib/suggestionsStore.js';

const allowedDecisions = new Set(['pending', 'accepted', 'rejected', 'modified']);

function normalize(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function truncate(value, max) {
  return value.length > max ? value.slice(0, max) : value;
}

function bodyOf(req) {
  if (typeof req.body === 'object' && req.body) return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  if (req.method === 'PATCH') {
    const body = bodyOf(req);
    const id = normalize(body.id);
    const decision = normalize(body.decision);
    const adminNote = truncate(normalize(body.adminNote), 1000);

    if (!id || !allowedDecisions.has(decision)) {
      res.status(400).json({ error: 'invalid_payload' });
      return;
    }

    const updated = await updateSuggestionDecision(id, decision, adminNote);
    if (!updated) {
      res.status(404).json({ error: 'not_found' });
      return;
    }

    res.status(200).json(updated);
    return;
  }

  if (req.method === 'DELETE') {
    const id = normalize(req.query?.id);
    if (!id) {
      res.status(400).json({ error: 'missing_id' });
      return;
    }

    const removed = await deleteSuggestion(id);
    if (!removed) {
      res.status(404).json({ error: 'not_found' });
      return;
    }

    res.status(200).json({ ok: true });
    return;
  }

  res.setHeader('Allow', 'PATCH, DELETE');
  res.status(405).json({ error: 'method_not_allowed' });
}
