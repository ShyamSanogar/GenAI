# GenAI RAG Server — Security Hardening

This document covers the security features implemented for the Node.js/Express RAG (Retrieval-Augmented Generation) server, which uses Gemini for embeddings and answer generation over an indexed PDF.

Overview

## The server originally exposed two unauthenticated, unrate-limited endpoints:

POST /api/index   → re-embeds the source PDF and rebuilds the vector store
POST /api/ask     → embeds a user question, retrieves top-k chunks, and calls Gemini to answer

Both endpoints call paid Gemini APIs (embeddings + generation) with no access control, meaning anyone who discovered the URL could run up API costs indefinitely or repeatedly trigger expensive re-indexing. This was the highest-priority risk in the project, so it was addressed first with API key authentication and route-level rate limiting. A query sanitization layer was also added to reduce prompt injection risk.

## Features Implemented
### 1. API Key Authentication (middleware/auth.js)

Purpose: Prevent unauthorized clients from calling the Gemini-backed endpoints at all.

### How it works:

Reads the x-api-key header from incoming requests.
Hashes both the provided key and the expected key (process.env.SERVER_API_KEY) with SHA-256, then compares the digests using crypto.timingSafeEqual.
Hashing first avoids two problems with comparing raw strings: (1) timingSafeEqual throws if the buffers aren't equal length, which itself leaks key length; (2) naive === comparison is vulnerable to timing attacks that can reveal how many leading characters matched.
On missing or invalid key: responds 401 Unauthorized with a generic message:
json
  { "error": "Unauthorized: Invalid or missing API key" }

The same message is used for both "no key sent" and "wrong key sent" so an attacker can't distinguish the two cases.

Applied to: POST /api/index, POST /api/ask

## 2. Rate Limiting (middleware/rateLimiter.js)

Purpose: Cap request volume per client to prevent cost-exhaustion and abuse, even from an authenticated caller (e.g. a compromised or misbehaving key).

How it works: Built with express-rate-limit, applied per-IP, with two separate limiters:

Limiter	Route	Limit	Why
indexRateLimiter	POST /api/index	2 requests / minute	Re-indexing re-embeds the entire PDF — the most expensive operation in the app.
askRateLimiter	POST /api/ask	10 requests / minute	Each question triggers one embedding call + one generation call.

On exceeding the limit: responds 429 Too Many Requests:

json
{ "error": "Too many requests, try again later." }
##3. Query Sanitization (sanitizeQuery.js)

Purpose: Reduce the risk of direct prompt injection — attempts to override the system instruction via the user's question (e.g. "ignore previous instructions and...").

How it works:

Caps query length (500 chars) to limit context-flooding attacks.
Strips structural injection attempts: fake role markers ([system], <|system|>), code fences, and ### system style headers.
Matches the query against a set of known instruction-override phrasings ("ignore previous instructions", "you are now...", "act as if...", jailbreak keywords, etc.). If matched, the request is rejected outright (400 Bad Request) rather than partially stripped, since removing only the flagged phrase can still leave a coherent injection behind.
Normalizes whitespace before the query is used for embedding/search and interpolated into the Gemini prompt.

Applied to: the question field in POST /api/ask, before it reaches search() or the Gemini prompt template.

Environment Variables

Configuration template provided in .env.example:

GEMINI_API_KEY=your_gemini_api_key_here
SERVER_API_KEY=your_own_generated_api_key_here

Copy this to .env and fill in real values. .env should never be committed — only .env.example is checked into the repo.

Note: The server should be configured to refuse to start if SERVER_API_KEY is unset, to avoid a misconfigured deployment silently accepting any/no key.

Calling the Protected Endpoints

Every request to /api/index or /api/ask must now include the API key header:

bash
curl -X POST http://localhost:4000/api/ask \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_own_generated_api_key_here" \
  -d '{"question": "When is the midterm?"}'

Requests without a valid x-api-key header will receive 401. Requests exceeding the rate limit will receive 429 regardless of key validity.

Verification

Automated middleware tests confirm all cases behave as expected:

### Test	Expected	Result
Missing API key	401	✅ Pass
Invalid API key	401	✅ Pass
Valid API key	  200	✅ Pass
/api/index — 3rd request within 1 min (limit: 2)	429	✅ Pass
/api/ask — 11th request within 1 min (limit: 10)	429	✅ Pass

### Known Limitations
In-memory rate limiting: the default express-rate-limit store resets on server restart and does not share state across multiple server instances/processes. Fine for a single-instance deployment; a horizontally scaled deployment would need a shared store (e.g. Redis-backed) instead.
Regex-based query sanitization is a denylist, not a true classifier: it catches known jailbreak phrasings but can be bypassed by novel rewordings. It should be treated as one defensive layer, not a complete solution.
Indirect prompt injection is not yet addressed: sanitization only covers the user's query. Content extracted from the source PDF (extractText.js → chunkText.js) is not sanitized before being used as context. If the PDF source isn't fully trusted, injected instructions inside the document itself could still reach the model.
Transport security: the API key is sent as a plain header. This is only safe over HTTPS — the app should not be deployed over plain HTTP in any environment beyond local testing.
Error response sanitization: current error handling returns err.message directly to the client in some paths, which can leak internal details (e.g. raw Gemini API error text). Recommended next step: log full errors server-side and return a generic message to callers.

## Suggested Next Steps
1.Sanitize error responses returned to clients (log internally, return generic messages).
2.Sanitize/validate PDF-extracted content to mitigate indirect prompt injection.
3.Move to a persistent/shared rate-limit store if deploying beyond a single instance.
4.Add request logging/monitoring on auth failures and rate-limit hits to detect abuse patterns.
