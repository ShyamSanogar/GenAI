const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for /api/ask: Max 10 requests per minute per IP.
 */
const askRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: { error: 'Too many requests, try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Stricter rate limiter for /api/index: Max 2 requests per minute per IP (expensive re-indexing).
 */
const indexRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2, // 2 requests per minute
  message: { error: 'Too many requests, try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  askRateLimiter,
  indexRateLimiter,
};
