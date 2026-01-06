const LOG_PREFIX = "[LuminaAI]";

const safeSerialize = (value: unknown) => {
    try {
        return JSON.stringify(value);
    } catch {
        return "[unserializable]";
    }
};

const formatMessage = (message: string, data?: unknown) => {
    if (data === undefined) {
        return `${LOG_PREFIX} ${message}`;
    }
    return `${LOG_PREFIX} ${message} ${safeSerialize(data)}`;
};

export const log = (message: string, data?: unknown) => {
    if (__DEV__) {
        console.log(formatMessage(message, data));
    }
};

export const warn = (message: string, data?: unknown) => {
    if (__DEV__) {
        console.warn(formatMessage(message, data));
    }
};

export const error = (message: string, data?: unknown) => {
    if (__DEV__) {
        console.error(formatMessage(message, data));
    }
};
