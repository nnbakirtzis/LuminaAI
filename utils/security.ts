/**
 * Security utilities for sanitizing user input before it is interpolated into agent prompts.
 */

/**
 * Basic sanitization to strip HTML tags and remove potentially malicious script characters.
 */
export const sanitizeInput = (text: string): string => {
  if (!text) return "";

  // 1. Strip HTML tags
  let sanitized = text.replace(/<[^>]*>?/gm, "");

  // 2. Extra removal of stray brackets
  sanitized = sanitized.replace(/[<>]/g, "").trim();

  // 3. Limit length to prevent large-payload issues
  if (sanitized.length > 500) {
    sanitized = sanitized.substring(0, 500);
  }

  return sanitized;
};

/**
 * Wraps user-provided text in clear delimiters to prevent prompt injection.
 * Agent system instructions tell the model to treat delimited content as data only.
 */
export const wrapUserText = (text: string): string => {
  const sanitized = sanitizeInput(text);
  return `[USER_DATA_START]\n${sanitized}\n[USER_DATA_END]`;
};
