const crypto = require('crypto');

/**
 * Middleware to enforce API Key authentication via custom header (x-api-key).
 * Performs a timing-safe comparison against process.env.SERVER_API_KEY.
 */
function requireApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.SERVER_API_KEY;

  if (!apiKey || !expectedApiKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }

  // Hash both keys to fixed 32-byte SHA-256 buffers.
  // This guarantees equal buffer lengths for timingSafeEqual, avoiding timing side-channel leaks.
  const providedHash = crypto.createHash('sha256').update(String(apiKey)).digest();
  const expectedHash = crypto.createHash('sha256').update(String(expectedApiKey)).digest();

  if (!crypto.timingSafeEqual(providedHash, expectedHash)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
  }

  next();
}

module.exports = { requireApiKey };
