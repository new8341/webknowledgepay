# webknowledgepay — Cursor 与协作说明

本文件记录在 **Cursor** 中开发本项目时的约定、与仓库相关的对话要点，以及换机/协作方式。前端应用说明见 [`web/README.md`](web/README.md)。

**完整对话整理（含思考过程与命令执行）**：见 [`cursor-notes.md`](cursor-notes.md)。

## 远程仓库

- **GitHub**：<https://github.com/new8341/webknowledgepay>
- 默认分支：`main`

在新电脑继续开发：

```bash
git clone https://github.com/new8341/webknowledgepay.git
cd webknowledgepay
```

用 **同一 Cursor 账号** 登录即可使用订阅与额度；**代码以 Git 为准**，换机后请 `git pull` 再开始改。

## 本地 Git 配置（与本项目相关）

- 首次在本机提交前需配置提交者信息，否则 `git commit` 会失败：
  - `git config --global user.name "你的名字"`
  - `git config --global user.email "你的邮箱"`
  - 若只想作用于当前仓库，去掉 `--global`，在仓库根目录执行即可。
- `git remote add origin` / `git remote set-url origin` 必须使用 **真实仓库地址**，不能使用占位符（例如 `你的用户名/你的仓库名`），否则会出现 `Repository not found`。
- 本仓库曾将 `origin` 设为：`https://github.com/new8341/webknowledgepay.git`，并已向 `main` 完成首次推送。

## Cursor 对话与「同步」

- **对话记录（Chat / Composer）不会**像云盘一样，仅因「登录同一 Cursor 账号」就自动出现在另一台电脑；重要结论请写入 **本仓库文档、Issue 或 PR**，或与 [`web/README.md`](web/README.md) 一并维护。
- 若需备份或迁移对话，请使用 Cursor 当前版本支持的导出/扩展功能，或自行查阅官方文档；**不要依赖**对话作为唯一的需求来源。

## 仓库结构提示

- `web/`：Vue 前端工程（安装依赖、运行与测试见 [`web/README.md`](web/README.md)）。
- `web-tu/`：静态原型/HTML 等素材，与 `web/` 分离。

## 安全提醒

- 勿将 **API 密钥、`.env` 明文** 提交到 Git；确保 `.gitignore` 已忽略敏感文件。
- `node_modules` 通常不提交，换机后在 `web/` 下重新执行安装命令。

---

*本 README 由项目相关 Cursor 对话整理写入，随流程变更可继续补充。*
