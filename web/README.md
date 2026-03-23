# 稀际课堂（高保真原型）- Vue3 + TS + Vite + Tailwind + Vuex

本项目基于你提供的高保真原型（`../web-tu/`）进行模块化落地，技术栈为：`TypeScript + Tailwind CSS + Vue3 + Vite + Vuex`。

## 实现内容与模块化理念

1. 模块化拆分：将业务按模块拆成独立的 `views`（页面）与 `store/modules`（状态），并通过 `router` 进行路由组织。
2. 全局变量使用 `Vuex`：平台名称、模块清单、课程数据、学习统计、购物车等信息在 `src/store` 下统一管理，页面通过 `useStore()` 读取。
3. 模块命名与展示：首页增加了“全局模块划分”展示区，会把每个模块的 `key / name / description / route` 展示出来，满足“给每个模块起名并展示”要求。
4. 中文注释：代码中关键结构（布局、模块展示、购买/购物车等位置）保持中文注释，提升可读性与后续协作效率。

## 全局模块（页面）清单

- `首页模块`：`/`（包含热门课程与“模块划分展示区”）
- `登录模块`：`/login`
- `课程模块`：`/courses`
- `课程详情模块`：`/course-detail`
- `学习模块`：`/learn-center`
- `播放模块`：`/course-play`
- `购物车模块`：`/cart`

## 主要目录

- `src/router/index.ts`：路由配置（按模块组织页面）
- `src/store/`：Vuex 全局状态
  - `src/store/modules/app.ts`：平台名称与模块清单（用于展示/导航）
  - `src/store/modules/user.ts`：用户登录状态（示例）
  - `src/store/modules/course.ts`：课程/分类/热门课程（示例数据）
  - `src/store/modules/learning.ts`：学习统计（示例）
  - `src/store/modules/cart.ts`：购物车列表与总价 getter
- `src/layouts/MainLayout.vue`：统一布局（顶部导航 + 页面内容区）
- `src/components/AppNav.vue`：顶部模块导航（从 Vuex 的 modules 渲染）
- `src/components/ModulePanel.vue`：首页模块命名展示区
- `src/views/*.vue`：各业务模块页面

## 运行方式

在 `web` 目录下执行：

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

预览（构建后使用）：

```bash
npm run preview
```

## 说明

当前页面实现以“原型 UI 的结构与模块流程”为主（数据使用 Vuex 内的示例状态）。后续你如果提供更细的交互逻辑/接口数据，我可以继续把：
- 登录注册的表单交互与校验
- 课程筛选/排序
- 购物车数量增减、全选与结算步骤
- 播放页的章节/笔记/讨论面板状态

进一步对齐高保真原型效果。

## 执行记录（高保真页面逐步对齐）

### Home（首页）
- 重写 `HomeView`：对齐原型 `web-tu/home.html` 的顶部导航、Hero、热门分类/热门课程/页脚结构与样式。
- 接入交互状态：
  - 购物车角标：使用 Vuex `cart/selectedCount`
  - 登录按钮：根据 `user.isLoggedIn` 切换进入学习
  - “立即购买”：dispatch `cart/setItemSelected` 将对应课程标记为已选中
- 路由策略：`/` 使用 `meta.hideAppNav=true` 避免重复导航。
- 验证：`npm run build` 通过，lints 无错误。

### Courses（课程分类页）
- 重写 `CoursesView`：对齐原型 `web-tu/courses.html` 的筛选器、排序/视图切换、热门标签、课程卡片（收藏心形/加入购物车）、以及页面结构。
- Vuex 与数据链路：
  - `course/fetchCourses`（mock）提供课程列表与分类总数。
  - “加入购物车”：dispatch `cart/setItemSelected` 让购物车能体现已选状态。
- 错误与测试：
  - mock API 失败统一抛出 `error.code/message/requestId/status`，失败不返回 200。
  - 新增测试 `tests/api.courses.test.ts`：1 个成功 + 1 个失败。
- 验证：`npm run build` 通过，node:test 用例通过。

### Learn Center（学习中心）
- 重写 `LearnCenterView`：对齐原型 `web-tu/learn-center.html` 的顶部导航、左侧个人导航、统计卡片、最近学习、学习计划、学习统计与成就展示。
- Vuex 与数据链路：
  - 新增 `apiFetchLearnCenterBundle`（mock）
  - `learning/initLearnCenter` 初始化 `learnCenter` 状态，并在失败时写入统一错误结构并 throw。
- 路由策略：`/learn-center` 使用 `meta.hideAppNav=true` 避免重复导航。
- 验证：`npm run build` 通过；node:test 仍通过。

### Course Detail（课程详情页）
- 重写 `CourseDetailView`：对齐原型 `web-tu/course-detail.html` 的视频预览区、课程基本信息、课程包含、介绍/目录/评价/FAQ tab、购买卡、分享与相关推荐结构。
- Vuex 与数据链路：
  - `course` 模块新增 `detail` state（activeTab/bundle/loading/error）
  - 新增 `apiFetchCourseDetailBundle`（mock）并在 `course/initCourseDetail` 初始化。
- 错误结构：失败统一 `code/message/requestId/status`，失败不返回 200。
- 验证：`npm run build` 通过。

### Course Play（课程播放页）
- 提升 `CoursePlayView` 高保真对齐：
  - 顶部栏显示当前播放分组标题（“第X章：...”）
  - 右侧目录改为“章节折叠”结构
  - 当前播放章节在目录中保持高亮，折叠组随数据加载自动展开
  - tabs（目录/笔记/讨论）完全由 `learning.playback` 状态驱动
- 交互默认值修正：`activeChapterId` 默认对应原型高亮章节。
- 验证：`npm run build` 通过；node:test 通过。

## 本次计划（两页一起做：待你确认）

你要求“两页一起做、不要顺手重构”。我理解接下来应同时完成：
1. `Login（登录模块）`：对齐原型 `web-tu/login.html`，表单切换（登录/注册）与密码可见性等交互由组件状态驱动，并在点击登录时调用 Vuex action -> API mock。
2. `Profile（个人中心模块）`：新增 `ProfileView` 与 `/profile` 路由，对齐原型 `web-tu/profile.html` 的个人资料页结构，主要字段由 Vuex 的 profile 状态渲染。

实现前我会先补齐：
- `apiLogin` / `apiFetchProfile`（mock，失败抛统一 `error.code + message + requestId`，失败不返回 200）
- `user` Vuex 模块 actions/mutations（login/fetchProfile）
- node:test：至少 1 个成功 + 1 个失败（建议覆盖 `apiLogin`）

## 本次输出（Login + Profile）

### Login（登录模块）
- 完成 `LoginView`：对齐原型 `web-tu/login.html` 的登录/注册页结构，使用组件状态驱动表单切换、密码可见性与焦点态样式。
- 点击“登录”后：dispatch Vuex action `user/login`，登录成功后跳转到 `/learn-center`。
- 统一错误展示：页面读取 `user.error`，并显示 `error.code + message + requestId`。

### Register（注册补齐）
- 补齐注册提交链路：`LoginView` 的“立即注册”会 dispatch Vuex action `user/register`，成功后跳转到 `/learn-center`。
- 补齐注册成功后的跳转目标：跳转到个人中心 `/profile`。
- 接入统一错误结构：注册页同样读取 `user.error` 并展示 `error.code + message + requestId`。

### Profile（个人中心模块）
- 新增 `ProfileView` 与 `/profile` 路由（`meta.hideAppNav=true`），顶部导航与左侧个人菜单结构对齐原型。
- 进入页面后：`onMounted` dispatch Vuex action `user/fetchProfile` 初始化 `user.profile`，并用 Vuex 状态渲染个人资料、账户统计、最近订单、学习成就与学习分析等模块。

### Mock API & Vuex & Tests
- 新增 mock API：
  - `apiLogin`：固定账号 `13800000000` + 密码 `123456` 成功，其它失败；失败统一 `error.code + message + requestId`，失败不返回 `200`。
  - `apiFetchProfile`：返回个人中心 bundle 数据（mock）。
  - `apiRegister`：固定账号/验证码/密码组合成功，其它失败统一抛出 `error.code + message + requestId`，失败不返回 `200`。
- 扩展 Vuex `user` 模块：
  - 新增 `loading/error/profile` 状态，以及 `login/fetchProfile/register` actions，对失败错误进行统一归一化处理后 throw。
- 新增 node:test：`tests/api.auth.test.ts` + `tests/api.register.test.ts`
  - `apiLogin`：覆盖 1 个成功 + 1 个失败，并断言统一错误字段齐全、`AppApiError` 实例化。
  - `apiRegister`：覆盖 1 个成功 + 1 个失败，并断言统一错误字段齐全、`AppApiError` 实例化。

### 验证结果
- `npm run build`：通过。
- `npx tsc -p tsconfig.test.json`：通过。
- `node --test .tmp-test/tests/*.test.js`：通过（8/8）。

## 本次输出（修复 CoursePlay 页运行时报错）

### 问题与修复
- 修复 `learning` 模块 action 中对 state 的错误读取：
  - 由 `state.learning.playback...` 改为 `state.playback...`
  - 涉及 `selectChapter`、`setPlaybackTab`、`fetchNotes`、`fetchDiscussions`
- 根因：Vuex 模块 action 的 `state` 是模块本地 state，不应再套 `learning` 层级；原写法在切换章节时触发 `Cannot read properties of undefined (reading 'playback')`。

### 测试补充（1 成功 + 1 失败）
- 新增 `tests/learning.actions.test.ts`
  - 成功场景：`selectChapter` 在 `activeTab=notes` 时可正确 dispatch `fetchNotes`
  - 失败场景：`fetchNotes` 链路抛出统一错误对象时，`selectChapter` 会向上抛出，便于页面展示统一错误结构
- 更新 `tsconfig.test.json`，纳入 `src/store/modules/learning.ts` 以参与测试编译。

### 本次验证结果
- `npm run build`：通过
- `npx tsc -p tsconfig.test.json`：通过
- `node --test .tmp-test/tests/*.test.js`：通过（10/10）

## 手动回归清单（CoursePlay）
1. 打开 `/course-play` 页面，确认控制台不再出现 `Cannot read properties of undefined (reading 'playback')`，并且目录数据正常渲染、默认展开组包含当前高亮章节（`activeChapterId=203`）。
2. 在“目录”中分别点击普通章节与 `isLocked=true` 的章节，确认切换高亮正常且锁定项不可用（不会触发报错）。
3. 在侧边栏切换 tabs：目录 -> 笔记 -> 讨论，确认每次切换不报错、内容区域可正常刷新（notes/discussions 列表与 loading 状态正常）。
4. 快速连续切换：在未等数据完全加载结束的情况下连续点若干章节与 tabs，确认不会出现 undefined 报错或页面卡死。
5. （失败路径）使用 Vue Devtools 把 `learning.playback.error` 设置为一个包含 `code/message/requestId/status` 的对象，确认右侧/左侧错误展示区能正确显示 `code` 与 `message`，且不再触发运行时异常。

## 本地启动命令（Windows PowerShell）

### 标准启动（推荐）
```powershell
cd D:\cursor\webknowledgepay\web
npm run dev
```

### 指定 Host 与端口（可选）
```powershell
cd D:\cursor\webknowledgepay\web
npm run dev -- --host 127.0.0.1 --port 5173
```

### 任意目录启动（可选）
```powershell
npm run dev --prefix D:\cursor\webknowledgepay\web
```

## 本次输出（修复 LoginView 编译报错）

### 问题与修复
- 修复 `src/views/LoginView.vue` 的 SFC 结构错误：将误放在 `<template>` 内部的 `<style scoped>` 移到 `<template>` 外部，与 `<script setup>` / `<template>` 同级。
- 该问题会触发 Vite/Vue 编译错误：`Tags with side effect (<script> and <style>) are ignored in client component templates.`，导致页面启动时出现红色错误覆盖层。

### 影响范围
- 仅影响 `LoginView.vue` 页面编译与渲染，不改 public API，不改业务交互逻辑，不引入新依赖。

### 验证结果
- `npm run build`：通过
- `npx tsc -p tsconfig.test.json`：通过
- `node --test .tmp-test/tests/*.test.js`：通过（10/10）

## 本次输出（修复 ProfileView 编译报错）

### 问题与修复
- 实际报错文件为 `src/views/ProfileView.vue`（Vite 提示 `Tags with side effect (<script> and <style>) are ignored in client component templates`），根因与 LoginView 相同：`<style scoped>` 被写在根 `<template>` 闭合之前。
- 修复方式：将 `<style scoped>` 移到根 `</template>` 之后，与 `<script setup>` / `<template>` 同级。

### 测试补充（1 成功 + 1 失败）
- 新增 `tests/profileView.sfc.test.ts`：用字符串顺序校验「最后一个 `</template>` 必须在 `<style` 之前」，并包含一个故意错误的 SFC 片段作为失败用例。

### 验证结果
- `npm run build`：通过
- `npx tsc -p tsconfig.test.json`：通过
- `node --test .tmp-test/tests/*.test.js`：通过（12/12）
