# WINDY · Digital Archive

个人档案馆，PC 首屏单页布局，部署于 GitHub Pages。

**在线预览：** https://abcdzyone.github.io/windy.github.io/

## 设计

- 单屏 PC 布局：Header → Hero → Latest Update → 6 栏分类网格 → Footer
- 半色调（Halftone）印刷风格图片处理
- 米白纸张配色 + 黑色文字，Inter / Noto Sans SC 字体

## 结构

```
├── index.html          # 首屏单页
├── css/style.css
├── js/main.js
└── blog/*.html         # 文章详情页
```

## 首屏板块

| 区域 | 内容 |
|------|------|
| Header | WINDY. · 导航 · GitHub |
| Hero | DIGITAL ARCHIVE + 肖像 + 简介 |
| Ticker | 最新文章滚动条 |
| Grid 001–006 | About / Projects / Writing / Reading / Notes / Timeline |
| Footer | 版权 · 引言 · 联系方式 |

## 本地预览

```bash
npx serve .
```
