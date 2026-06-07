# Windy · Personal Site

个人开发者主页 + 技术博客，部署于 GitHub Pages。

**在线预览：** https://abcdzyone.github.io/windy.github.io/

## 特性

- 苹果系统字体，粒子背景，技术博客
- 公开 API 实时数据（天气、空气、汇率等）
- **WeRead Reading Hub** 脱敏快照（不暴露后端 API）

## WeRead 数据同步（不暴露 API）

前端只读取 `data/weread-public.json`，**不会**在浏览器里请求你的服务器。

1. 在 GitHub 仓库 **Settings → Secrets → Actions** 添加：
   - `WEREAD_API_BASE` = `http://39.105.24.82:8080`（或你的内网/公网地址）
2. Actions 工作流 `Sync WeRead public data` 每 6 小时拉取一次，也可手动 Run workflow
3. 本地手动同步：

```bash
set WEREAD_API_BASE=http://39.105.24.82:8080
node scripts/sync-weread-public.mjs
git add data/weread-public.json && git commit -m "chore: sync weread data"
```

## 结构

```
├── index.html
├── data/weread-public.json   ← 脱敏快照（前端只读这个）
├── scripts/sync-weread-public.mjs
├── .github/workflows/sync-weread-data.yml
├── css/
└── js/
```
