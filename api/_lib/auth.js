function normalize(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function getBearerToken(req) {
  const auth = normalize(req.headers?.authorization || req.headers?.Authorization);
  if (!auth.toLowerCase().startsWith('bearer ')) return '';
  return auth.slice(7).trim();
}

export function isAdminAuthorized(req) {
  const expected = normalize(process.env.SUGGESTIONS_ADMIN_PASSWORD);
  if (!expected) return false;
  return getBearerToken(req) === expected;
}

export function requireAdmin(req, res) {
  const expected = normalize(process.env.SUGGESTIONS_ADMIN_PASSWORD);
  if (!expected) {
    res.status(503).json({ error: 'admin_password_not_configured' });
    return false;
  }
  if (!isAdminAuthorized(req)) {
    res.status(403).json({ error: 'forbidden' });
    return false;
  }
  return true;
}
