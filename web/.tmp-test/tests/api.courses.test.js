import test from 'node:test';
import assert from 'node:assert/strict';
import { apiFetchCourses, AppApiError } from '../src/api/index.js';
test('apiFetchCourses success: status=200 returns courses list', async () => {
    const res = await apiFetchCourses({ category: '编程开发' });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.data.courses));
});
test('apiFetchCourses failure: unified error fields', async () => {
    let err;
    try {
        await apiFetchCourses({
            category: '编程开发',
            simulateError: { code: 'NOT_FOUND', message: '课程不存在', status: 404 },
        });
    }
    catch (e) {
        err = e;
    }
    assert.ok(err, '期望 apiFetchCourses 抛出错误');
    const payload = err;
    assert.equal(payload.code, 'NOT_FOUND');
    assert.equal(payload.message, '课程不存在');
    assert.equal(payload.status, 404);
    assert.ok(typeof payload.requestId === 'string' && payload.requestId.length > 0);
    assert.ok(err instanceof AppApiError);
});
