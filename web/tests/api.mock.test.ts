import test from 'node:test'
import assert from 'node:assert/strict'
import { apiFetchNotes } from '../src/api/index.js'
import type { ApiErrorPayload } from '../src/api/index.js'
import { AppApiError } from '../src/api/index.js'

test('apiFetchNotes success: status=200 returns notes list', async () => {
  const res = await apiFetchNotes(203)
  assert.equal(res.status, 200)
  assert.ok(Array.isArray(res.data))
})

test('apiFetchNotes failure: unified error.code/message/requestId', async () => {
  let err: unknown
  try {
    await apiFetchNotes(203, {
      simulateError: { code: 'NOT_FOUND', message: '笔记不存在', status: 404 },
    })
  } catch (e) {
    err = e
  }

  assert.ok(err, '期望 apiFetchNotes 抛出错误')
  const payload = err as ApiErrorPayload
  assert.equal(payload.code, 'NOT_FOUND')
  assert.equal(payload.message, '笔记不存在')
  assert.equal(payload.status, 404)
  assert.ok(typeof payload.requestId === 'string' && payload.requestId.length > 0)

  // 也应保持为 Error 实例（方便上层 catch/日志）
  assert.ok(err instanceof AppApiError)
})

