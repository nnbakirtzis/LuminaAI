/**
 * Security utilities for sanitizing user input and preventing injection attacks.
 */

/**
 * Basic sanitization to strip HTML tags and remove potentially malicious script characters.
 */
export const sanitizeInput = (text: string): string => {
    if (!text) return "";

    // 1. Strip HTML tags
    let sanitized = text.replace(/<[^>]*>?/gm, "");

    // 2. Escape common special characters that could be used in injection
    sanitized = sanitized
        .replace(/[<>]/g, "") // Extra removal of brackets
        .trim();

    // 3. Limit length to prevent buffer/large-payload issues
    if (sanitized.length > 500) {
        sanitized = sanitized.substring(0, 500);
    }

    return sanitized;
};

/**
 * Wraps user-provided text in clear delimiters to prevent prompt injection.
 */
export const wrapUserText = (text: string): string => {
    const sanitized = sanitizeInput(text);
    return `[USER_DATA_START]\n${sanitized}\n[USER_DATA_END]`;
};

/**
 * Validate that a string doesn't contain obvious prompt injection attempts.
 */
export const containsInjectionAttempt = (text: string): boolean => {
    const lower = text.toLowerCase();
    const markers = [
        "ignore all previous",
        "system prompt",
        "new instructions",
        "ignore instructions",
        "you are now a",
        "forget your original",
    ];

    return markers.some(marker => lower.includes(marker));
};
