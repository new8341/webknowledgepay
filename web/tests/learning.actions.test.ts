import test from 'node:test'
import assert from 'node:assert/strict'
import learningModule from '../src/store/modules/learning.js'

const actions = (learningModule as any).actions

test('learning/selectChapter success: reads module state and dispatches notes fetch', async () => {
  const commits: Array<[string, number]> = []
  const dispatches: string[] = []

  const ctx = {
    state: {
      playback: {
        activeTab: 'notes',
        activeChapterId: 203,
      },
    },
    commit(type: string, payload: number) {
      commits.push([type, payload])
    },
    async dispatch(type: string) {
      dispatches.push(type)
    },
  }

  await actions.selectChapter(ctx, 202)

  assert.deepEqual(commits, [['setActiveChapterId', 202]])
  assert.deepEqual(dispatches, ['fetchNotes'])
})

test('learning/selectChapter failure: bubbles unified error payload', async () => {
  const expectedError = {
    code: 'UNKNOWN',
    message: '加载笔记失败',
    requestId: 'req_test',
    status: 500,
  }

  const ctx = {
    state: {
      playback: {
        activeTab: 'notes',
        activeChapterId: 203,
      },
    },
    commit() {},
    async dispatch() {
      throw expectedError
    },
  }

  let err: unknown
  try {
    await actions.selectChapter(ctx, 202)
  } catch (e) {
    err = e
  }

  assert.ok(err, '期望 selectChapter 抛出错误')
  assert.deepEqual(err, expectedError)
})

