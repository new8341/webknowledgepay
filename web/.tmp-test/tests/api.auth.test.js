import test from 'node:test';
import assert from 'node:assert/strict';
import { apiLogin, AppApiError } from '../src/api/index.js';
test('apiLogin success: fixed credentials', async () => {
    const res = await apiLogin('13800000000', '123456');
    assert.equal(res.status, 200);
    assert.equal(res.data.isLoggedIn, true);
    assert.equal(res.data.user.name, '张同学');
});
test('apiLogin failure: unified error code/message/requestId/status', async () => {
    let err;
    try {
        await apiLogin('', '');
    }
    catch (e) {
        err = e;
    }
    assert.ok(err, '期望 apiLogin 抛出错误');
    const payload = err;
    assert.equal(payload.code, 'VALIDATION_ERROR');
    assert.equal(payload.message, '手机号或密码不能为空');
    assert.equal(payload.status, 400);
    assert.ok(typeof payload.requestId === 'string' && payload.requestId.length > 0);
    assert.ok(err instanceof AppApiError);
});
