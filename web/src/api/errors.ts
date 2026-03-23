export type ApiErrorCode =
  | 'AUTH_REQUIRED'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'OUT_OF_STOCK'
  | 'NETWORK_ERROR'
  | 'UNKNOWN'

export interface ApiErrorPayload {
  code: ApiErrorCode
  message: string
  requestId: string
  status: number
}

export class AppApiError extends Error implements ApiErrorPayload {
  code: ApiErrorCode
  requestId: string
  status: number

  constructor(payload: ApiErrorPayload) {
    super(payload.message)
    this.name = 'AppApiError'
    this.code = payload.code
    this.requestId = payload.requestId
    this.status = payload.status
  }
}

export function createRequestId(): string {
  // 浏览器/Node 通用：优先使用 randomUUID，避免引入依赖。
  const anyCrypto = globalThis.crypto as unknown as { randomUUID?: () => string } | undefined
  if (anyCrypto?.randomUUID) return anyCrypto.randomUUID()
  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function toApiErrorPayload(input: unknown, fallback: Omit<ApiErrorPayload, 'requestId'>): ApiErrorPayload {
  if (input instanceof AppApiError) return input
  const requestId = createRequestId()
  if (input && typeof input === 'object' && 'message' in input) {
    const message = typeof (input as any).message === 'string' ? (input as any).message : fallback.message
    return { ...fallback, message, requestId }
  }
  return { ...fallback, requestId }
}

