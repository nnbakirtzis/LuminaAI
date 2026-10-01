/**
 * Security utilities for sanitizing user input before it is interpolated into agent prompts.
 */

/**
 * Basic sanitization to strip HTML tags and remove potentially malicious script characters.
 */
export const sanitizeInput = (text: string, maxLength = 500): string => {
  if (!text) return "";

  // 1. Strip HTML tags
  let sanitized = text.replace(/<[^>]*>?/gm, "");

  // 2. Extra removal of stray brackets
  sanitized = sanitized.replace(/[<>]/g, "");

  // 3. Remove our own delimiter tokens so data can't "close" its block early
  sanitized = sanitized.replace(/\[USER_DATA_(START|END)\]/g, "").trim();

  // 4. Limit length to prevent large-payload issues
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
};

/**
 * Wraps user-provided text in clear delimiters to prevent prompt injection.
 * Agent system instructions tell the model to treat delimited content as data only.
 */
export const wrapUserText = (text: string, maxLength = 500): string => {
  const sanitized = sanitizeInput(text, maxLength);
  return `[USER_DATA_START]\n${sanitized}\n[USER_DATA_END]`;
};

/**
 * Same delimiting for structured data (e.g. web-sourced job listings passed between agents).
 * Callers should sanitize individual string fields with sanitizeInput first.
 */
export const wrapUserData = (data: unknown): string =>
  `[USER_DATA_START]\n${JSON.stringify(data)}\n[USER_DATA_END]`;
