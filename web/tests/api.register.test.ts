import test from 'node:test'
import assert from 'node:assert/strict'
import { apiRegister, AppApiError } from '../src/api/index.js'
import type { ApiErrorPayload } from '../src/api/index.js'

test('apiRegister success: fixed credentials', async () => {
  const res = await apiRegister('13800000000', '123456', '123456', '123456')
  assert.equal(res.status, 200)
  assert.equal(res.data.isLoggedIn, true)
  assert.equal(res.data.profile.profile.name, '张同学')
})

test('apiRegister failure: unified error code/message/requestId/status', async () => {
  let err: unknown
  try {
    await apiRegister('13800000000', '000000', '123456', '123456')
  } catch (e) {
    err = e
  }

  assert.ok(err, '期望 apiRegister 抛出错误')
  const payload = err as ApiErrorPayload
  assert.equal(payload.code, 'AUTH_REQUIRED')
  assert.equal(payload.message, '验证码错误')
  assert.equal(payload.status, 401)
  assert.ok(typeof payload.requestId === 'string' && payload.requestId.length > 0)
  assert.ok(err instanceof AppApiError)
})

