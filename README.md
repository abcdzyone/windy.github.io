# WINDY · Tech Journal

个人技术博客，DevJournal 半色调（Dot-Matrix Monolith）风格，部署于 GitHub Pages。

**在线预览：** https://abcdzyone.github.io/windy.github.io/

## 设计

- **视觉语言**：黑白半色调、粗边框、零圆角 Brutalist 布局
- **字体**：JetBrains Mono 等宽字体
- **深度**：Halftone 点阵图案替代阴影与渐变
- **框架**：Tailwind CSS CDN + 静态 HTML

## 结构

```
├── index.html          # 首页（Hero + 精选 + 片段 + 动态）
├── blog.html           # 文章列表（搜索 + 分类侧边栏）
├── about.html          # 关于页（技术栈 + 时间线）
├── css/style.css       # 半色调工具类与 prose 样式
├── js/main.js          # 主题切换、阅读进度、代码复制等
└── blog/*.html         # 文章详情（TOC + 三栏阅读布局）
```

## 页面

| 页面 | 内容 |
|------|------|
| 首页 | Hero、精选文章、代码片段、GitHub 动态、项目卡片、订阅 |
| 博客 | 9 篇文章列表、客户端搜索、分类筛选、分页 |
| 关于 | 简介、技术栈 Bento、Now、时间线、阅读档案、联系 |
| 文章 | 固定 TOC、阅读进度条、代码高亮块、相关文章 |

## 本地预览

```bash
npx serve .
```
