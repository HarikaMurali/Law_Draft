<<<<<<< HEAD
=======
/**
 * Centralized Gemini AI helper with automatic retry and model fallback.
 *
 * • Primary model  : gemini-2.5-flash  (working with current key)
 * • Fallback model  : gemini-2.0-flash  (backup)
 * • Retries a 429 once after the server-suggested delay (max 60 s).
 */
>>>>>>> 66f77381e04af314442a171e9764063c060781d1
const { GoogleGenerativeAI } = require("@google/generative-ai");

const PRIMARY_MODEL = "gemini-2.5-flash";
const FALLBACK_MODEL = "gemini-2.0-flash";
<<<<<<< HEAD
const MAX_RETRY_DELAY_MS = 30_000;
const MAX_ATTEMPTS = 3;

let cachedClient = null;
let cachedKey = null;

class GeminiServiceError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "GeminiServiceError";
    this.statusCode = options.statusCode || 502;
    this.code = options.code || "GEMINI_REQUEST_FAILED";
    this.retryable = Boolean(options.retryable);
    this.cause = options.cause;
  }
}

function getApiKey() {
  const apiKey = process.env.GOOGLE_AI_KEY;
  if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
    throw new GeminiServiceError("Gemini is not configured: GOOGLE_AI_KEY is missing.", {
      statusCode: 500,
      code: "GEMINI_KEY_MISSING",
      retryable: false
    });
  }

  // Gemini API keys usually start with AIza; enforce a minimal sanity check.
  if (!apiKey.startsWith("AIza") || apiKey.length < 20) {
    throw new GeminiServiceError("Gemini API key format appears invalid. Please verify GOOGLE_AI_KEY.", {
      statusCode: 500,
      code: "GEMINI_KEY_INVALID",
      retryable: false
    });
  }

  return apiKey;
}

function getClient() {
  const apiKey = getApiKey();
  if (!cachedClient || cachedKey !== apiKey) {
    cachedClient = new GoogleGenerativeAI(apiKey);
    cachedKey = apiKey;
  }
  return cachedClient;
}

function getStatusCode(err) {
  if (typeof err?.status === "number") return err.status;
  if (typeof err?.statusCode === "number") return err.statusCode;
  const msg = String(err?.message || "");
  const match = msg.match(/\b(401|403|404|408|409|429|500|502|503|504)\b/);
  return match ? Number(match[1]) : null;
}

function isRetryableStatus(statusCode) {
  return [408, 409, 429, 500, 502, 503, 504].includes(statusCode);
}

function extractRetryMs(err) {
  const msg = String(err?.message || "");
  const retryDelayMatch = msg.match(/retryDelay[\s\S]*?(\d+(?:\.\d+)?)s/i);
  if (retryDelayMatch) {
    return Math.min(Math.ceil(parseFloat(retryDelayMatch[1]) * 1000), MAX_RETRY_DELAY_MS);
  }

  const retryAfterMatch = msg.match(/retry[\s\-]?after[\s:]+(\d+(?:\.\d+)?)/i);
  if (retryAfterMatch) {
    return Math.min(Math.ceil(parseFloat(retryAfterMatch[1]) * 1000), MAX_RETRY_DELAY_MS);
  }

  return null;
}

function getBackoffMs(attempt, err) {
  const serverRetryMs = extractRetryMs(err);
  if (serverRetryMs) return serverRetryMs;

  const exponential = Math.min(1000 * Math.pow(2, attempt - 1), MAX_RETRY_DELAY_MS);
  const jitter = Math.floor(Math.random() * 350);
  return exponential + jitter;
}

function normalizeGeminiError(err) {
  if (err instanceof GeminiServiceError) {
    return err;
  }

  const statusCode = getStatusCode(err);
  const retryable = isRetryableStatus(statusCode);

  if (statusCode === 401 || statusCode === 403) {
    return new GeminiServiceError(
      "Gemini authentication failed. Please verify GOOGLE_AI_KEY and billing/quota settings.",
      {
        statusCode: 502,
        code: "GEMINI_AUTH_ERROR",
        retryable: false,
        cause: err
      }
    );
  }

  if (statusCode === 429) {
    return new GeminiServiceError(
      "Gemini rate limit reached. Please retry shortly.",
      {
        statusCode: 429,
        code: "GEMINI_RATE_LIMIT",
        retryable: true,
        cause: err
      }
    );
  }

  return new GeminiServiceError(
    err?.message || "Gemini request failed.",
    {
      statusCode: retryable ? 503 : 502,
      code: retryable ? "GEMINI_TEMPORARY_FAILURE" : "GEMINI_REQUEST_FAILED",
      retryable,
      cause: err
    }
  );
}

=======
const MAX_RETRY_DELAY_MS = 60_000; // never wait more than 60 s

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

/**
 * Generate content with automatic retry + model fallback.
 * @param {string} prompt – the prompt text
 * @returns {Promise<string>} – the generated text
 */
async function generateContent(prompt) {
  // 1. Try primary model
  try {
    const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.warn(`[Gemini] ${PRIMARY_MODEL} failed: ${err.message}`);

    // If 429, extract retry delay and wait once
    const retryMs = extractRetryMs(err);
    if (retryMs && retryMs <= MAX_RETRY_DELAY_MS) {
      console.log(`[Gemini] Waiting ${Math.ceil(retryMs / 1000)}s before retry…`);
      await sleep(retryMs);
      try {
        const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (retryErr) {
        console.warn(`[Gemini] ${PRIMARY_MODEL} retry failed: ${retryErr.message}`);
      }
    }

    // 2. Try fallback model
    try {
      console.log(`[Gemini] Falling back to ${FALLBACK_MODEL}`);
      const fallback = genAI.getGenerativeModel({ model: FALLBACK_MODEL });
      const result = await fallback.generateContent(prompt);
      return result.response.text();
    } catch (fbErr) {
      console.error(`[Gemini] ${FALLBACK_MODEL} also failed: ${fbErr.message}`);
    }

    // 3. Nothing worked – re-throw the original error
    throw err;
  }
}

/* ── helpers ────────────────────────────────────────── */

>>>>>>> 66f77381e04af314442a171e9764063c060781d1
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

<<<<<<< HEAD
async function generateWithRetry({ prompt, modelName }) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const model = getClient().getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result?.response?.text?.();
      if (!text || !String(text).trim()) {
        throw new GeminiServiceError("Gemini returned an empty response.", {
          statusCode: 502,
          code: "GEMINI_EMPTY_RESPONSE",
          retryable: false
        });
      }
      return text;
    } catch (err) {
      const normalized = normalizeGeminiError(err);
      lastError = normalized;
      const canRetry = normalized.retryable && attempt < MAX_ATTEMPTS;

      if (!canRetry) {
        break;
      }

      const waitMs = getBackoffMs(attempt, err);
      console.warn(
        `[Gemini] ${modelName} attempt ${attempt}/${MAX_ATTEMPTS} failed (${normalized.code}). Retrying in ${waitMs}ms.`
      );
      await sleep(waitMs);
    }
  }

  throw lastError || new GeminiServiceError("Gemini request failed.");
}

/**
 * Generate text content with retries and model fallback.
 * @param {string} prompt – the prompt text
 * @returns {Promise<string>} – the generated text
 */
async function generateContent(prompt) {
  if (!prompt || typeof prompt !== "string") {
    throw new GeminiServiceError("Prompt is required for Gemini generation.", {
      statusCode: 400,
      code: "GEMINI_INVALID_PROMPT",
      retryable: false
    });
  }

  try {
    return await generateWithRetry({ prompt, modelName: PRIMARY_MODEL });
  } catch (err) {
    const primaryError = normalizeGeminiError(err);
    try {
      console.warn(`[Gemini] ${PRIMARY_MODEL} failed (${primaryError.code}). Trying ${FALLBACK_MODEL}.`);
      return await generateWithRetry({ prompt, modelName: FALLBACK_MODEL });
    } catch {
      throw primaryError;
    }
  }
}

/**
 * Generate multimodal content (e.g., OCR from image parts) with retry.
 * @param {Array|Object|string} contentParts
 * @param {Object} options
 * @returns {Promise<string>}
 */
async function generateVisionContent(contentParts, options = {}) {
  const modelName = options.model || FALLBACK_MODEL;
  if (!contentParts) {
    throw new GeminiServiceError("Content is required for Gemini multimodal generation.", {
      statusCode: 400,
      code: "GEMINI_INVALID_CONTENT",
      retryable: false
    });
  }

  return generateWithRetry({ prompt: contentParts, modelName });
}

module.exports = {
  generateContent,
  generateVisionContent,
  PRIMARY_MODEL,
  FALLBACK_MODEL,
  GeminiServiceError,
  normalizeGeminiError
}
=======
function extractRetryMs(err) {
  const msg = err?.message || "";
  const match = msg.match(/retryDelay.*?(\d+)s/i) || msg.match(/retry in (\d+[\.\d]*)/i);
  if (match) return Math.ceil(parseFloat(match[1]) * 1000);
  return null;
}

module.exports = { generateContent, PRIMARY_MODEL };
>>>>>>> 66f77381e04af314442a171e9764063c060781d1
