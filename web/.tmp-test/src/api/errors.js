export class AppApiError extends Error {
    code;
    requestId;
    status;
    constructor(payload) {
        super(payload.message);
        this.name = 'AppApiError';
        this.code = payload.code;
        this.requestId = payload.requestId;
        this.status = payload.status;
    }
}
export function createRequestId() {
    // 浏览器/Node 通用：优先使用 randomUUID，避免引入依赖。
    const anyCrypto = globalThis.crypto;
    if (anyCrypto?.randomUUID)
        return anyCrypto.randomUUID();
    return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
export function toApiErrorPayload(input, fallback) {
    if (input instanceof AppApiError)
        return input;
    const requestId = createRequestId();
    if (input && typeof input === 'object' && 'message' in input) {
        const message = typeof input.message === 'string' ? input.message : fallback.message;
        return { ...fallback, message, requestId };
    }
    return { ...fallback, requestId };
}
