# Digital Archive · Personal Site

软件工程师、AI 探索者与知识管理实践者的个人档案馆。部署于 GitHub Pages。

**在线预览：** https://abcdzyone.github.io/windy.github.io/

## 设计理念

- **Digital Archive** — 杂志/报纸风格的 editorial 设计，而非传统程序员模板
- 三栏网格布局，Halftone 半色调效果，Paper Grain 纸张纹理
- 米白纸张配色（`#F3EFE7` / `#F8F5EE`）+ 黑色文字
- Playfair Display 标题 + Inter 正文

## 结构

```
├── index.html              # 首页（三栏杂志布局）
├── css/
│   ├── style.css           # 主站样式
│   └── blog.css            # 文章页样式
├── js/main.js              # 阅读分类切换、移动端导航
├── assets/images/          # 静态资源
└── blog/
    ├── agents-changing-dev.html
    ├── cursor-observations.html
    ├── knowledge-system.html
    └── *.html              # 技术文章
```

## 首页板块

| 板块 | 说明 |
|------|------|
| Hero | DIGITAL ARCHIVE 标题 + 半色调肖像 |
| 001 · About | 六大关注领域 |
| Featured Work | 四个精选项目（01–04） |
| Reading Archive | 六类阅读分类 + 书架 |
| Latest Articles | 文章目录 |
| Timeline | 2023–2026 时间轴 |

## 本地预览

直接在浏览器打开 `index.html`，或使用任意静态服务器：

```bash
npx serve .
```

## 技术栈

纯静态 HTML / CSS / JavaScript，无构建工具，无框架依赖。
