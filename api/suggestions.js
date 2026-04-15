import { isAdminAuthorized } from './_lib/auth.js';
import { createSuggestion, listSuggestions } from './_lib/suggestionsStore.js';

const allowedKinds = new Set(['odznaka', 'ksiazeczka', 'regulamin', 'zrodlo', 'inne']);

function normalize(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function truncate(value, max) {
  return value.length > max ? value.slice(0, max) : value;
}

function isValidHttpUrl(value) {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
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

function publicView(item, includeContact) {
  if (includeContact) return item;
  const { contact, ...rest } = item;
  return rest;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const includeContact = isAdminAuthorized(req);
    const items = await listSuggestions();
    items.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    res.status(200).json(items.map(i => publicView(i, includeContact)));
    return;
  }

  if (req.method === 'POST') {
    const body = bodyOf(req);
    const kind = normalize(body.kind);
    const title = truncate(normalize(body.title), 160);
    const details = truncate(normalize(body.details), 4000);
    const sourceUrl = truncate(normalize(body.sourceUrl), 500) || undefined;
    const contact = truncate(normalize(body.contact), 200) || undefined;

    if (!allowedKinds.has(kind)) {
      res.status(400).json({ error: 'invalid_kind' });
      return;
    }

    if (!title || !details) {
      res.status(400).json({ error: 'missing_fields' });
      return;
    }

    if (!isValidHttpUrl(sourceUrl)) {
      res.status(400).json({ error: 'invalid_source_url' });
      return;
    }

    const created = await createSuggestion({ kind, title, details, sourceUrl, contact });
    res.status(201).json(publicView(created, false));
    return;
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ error: 'method_not_allowed' });
}
