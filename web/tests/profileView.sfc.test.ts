import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
// 编译输出在 `.tmp-test/tests/`，源码仍在项目根 `src/views/`
const profilePath = join(__dirname, '../../src/views/ProfileView.vue')

/** 根 <template> 必须在 <style> 之前闭合（style 不能写在模板内）。 */
function assertStyleAfterRootTemplateClose(content: string) {
  const lastTemplateClose = content.lastIndexOf('</template>')
  const styleOpen = content.indexOf('<style')
  if (lastTemplateClose < 0 || styleOpen < 0) {
    throw new Error('缺少 </template> 或 <style>')
  }
  if (styleOpen <= lastTemplateClose) {
    throw new Error('检测到 <style> 仍在根模板内（或位于最后一个 </template> 之前）')
  }
}

test('ProfileView.vue SFC: <style> 位于根 </template> 之后（成功）', () => {
  const content = readFileSync(profilePath, 'utf8')
  assert.doesNotThrow(() => assertStyleAfterRootTemplateClose(content))
})

test('SFC 结构错误示例：<style> 在根 </template> 之前应失败', () => {
  const bad = '<template><div></div><style scoped>.x{}</style></template>\n'
  assert.throws(() => assertStyleAfterRootTemplateClose(bad), /仍在根模板内/)
})
