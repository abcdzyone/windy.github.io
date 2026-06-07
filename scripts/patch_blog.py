# -*- coding: utf-8 -*-
"""UTF-8 safe batch patch for blog article pages."""
import os
import re

BLOG_DIR = os.path.join(os.path.dirname(__file__), '..', 'blog')

NAV_OLD_START = '<header class="fixed top-0 w-full z-50 bg-surface border-b-4 border-outline'
NAV_NEW = '''<nav class="fixed top-0 w-full z-50 bg-white border-b-4 border-black transition-all duration-200 ease-in-out" data-header>
<div class="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
<a href="../index.html" class="text-headline-md font-extrabold tracking-tighter uppercase">WINDY</a>
<div class="hidden md:flex items-center gap-8">
<a class="text-label-caps hover:bg-black hover:text-white px-2 py-1 transition-colors" href="../index.html">首页</a>
<a class="text-label-caps bg-black text-white px-2 py-1" href="../blog.html">博客</a>
<a class="text-label-caps hover:bg-black hover:text-white px-2 py-1 transition-colors" href="../about.html">关于</a>
</div>
<button id="theme-toggle" class="material-symbols-outlined p-1 border-2 border-black hover:bg-black hover:text-white transition-all">dark_mode</button>
</div>
</nav>'''

HERO = '''
        <div class="relative mb-10">
<div class="absolute inset-0 translate-x-2 translate-y-2 bg-black -z-10"></div>
<img class="w-full h-[400px] object-cover grayscale border-4 border-black" alt="" src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&q=80" />
</div>
'''

TABLE = '''
        <div class="overflow-x-auto mb-10">
<table class="w-full text-left border-4 border-black border-collapse">
<thead>
<tr class="bg-black text-white">
<th class="p-4 font-black uppercase text-xs border-r border-white">指标</th>
<th class="p-4 font-black uppercase text-xs border-r border-white">传统开发</th>
<th class="p-4 font-black uppercase text-xs">Agent 辅助</th>
</tr>
</thead>
<tbody class="text-body-md font-bold">
<tr class="border-b-2 border-black">
<td class="p-4 border-r-2 border-black bg-black/5">任务完成时间</td>
<td class="p-4 border-r-2 border-black">4h</td>
<td class="p-4 bg-black text-white">45min</td>
</tr>
<tr>
<td class="p-4 border-r-2 border-black bg-black/5">测试覆盖率</td>
<td class="p-4 border-r-2 border-black">62%</td>
<td class="p-4 bg-black text-white">89%</td>
</tr>
</tbody>
</table>
</div>
'''

IMG_URLS = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=240&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538a904?w=600&h=240&fit=crop&q=80',
]

def patch_file(path: str) -> None:
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    text = re.sub(r'<link[^>]*JetBrains Mono[^>]*>\s*', '', text)
    text = text.replace(
        "fontFamily: { mono: ['JetBrains Mono', 'monospace'] }",
        "fontFamily: { sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'], mono: ['SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'] }"
    )
    text = text.replace('font-mono halftone-page', 'halftone-page')
    text = text.replace('<article class="max-w-[720px] mx-auto w-full">', '<article class="max-w-content-max mx-auto bg-white p-8 w-full">')
    text = text.replace('stippled-box border-2 border-black', 'stippled-box bold-border')
    text = text.replace('<blockquote>', '<blockquote class="heavy-border stippled-box">')
    text = text.replace('相关文章', '相关日志')

    # Replace header nav block
    text = re.sub(
        r'<header class="fixed top-0 w-full z-50 bg-surface border-b-4 border-outline[^>]*>.*?</header>',
        NAV_NEW,
        text,
        count=1,
        flags=re.DOTALL,
    )

    # Related post images
    def add_img(m):
        nonlocal img_idx
        if 'object-cover grayscale' in m.group(0):
            return m.group(0)
        url = IMG_URLS[img_idx % len(IMG_URLS)]
        img_idx += 1
        return m.group(1) + f'\n            <img class="w-full h-40 object-cover grayscale border-2 border-black mb-4" alt="" src="{url}" />'

    img_idx = 0
    text = re.sub(
        r'(<a class="group block border-4 border-black p-6[^"]*"[^>]*>)',
        add_img,
        text,
    )

    basename = os.path.basename(path)
    if basename == 'agents-changing-dev.html':
        if 'photo-1677442136019' not in text:
            text = text.replace(
                '</p>\n\n        <h2 id="copilot-to-agent">',
                '</p>\n' + HERO + '\n        <h2 id="copilot-to-agent">',
            )
        if '任务完成时间' not in text:
            text = text.replace(
                '        <blockquote class="heavy-border stippled-box">',
                TABLE + '\n        <blockquote class="heavy-border stippled-box">',
            )

    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)
    print('patched', basename)


for name in sorted(os.listdir(BLOG_DIR)):
    if name.endswith('.html'):
        patch_file(os.path.join(BLOG_DIR, name))
