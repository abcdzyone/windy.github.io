# -*- coding: utf-8 -*-
import os
import re

ROOT = os.path.join(os.path.dirname(__file__), '..')
BRAND = 'WINDY<span class="brand-dot">.</span>'

for dirpath, _, files in os.walk(ROOT):
    if '.git' in dirpath.split(os.sep):
        continue
    for name in files:
        if not name.endswith('.html'):
            continue
        path = os.path.join(dirpath, name)
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
        orig = text
        text = re.sub(r'(class="[^"]*"[^>]*>)WINDY(</a>)', r'\1' + BRAND + r'\2', text)
        text = re.sub(r'(class="[^"]*"[^>]*>)WINDY(</div>)', r'\1' + BRAND + r'\2', text)
        while BRAND + '<span class="brand-dot">.</span>' in text:
            text = text.replace(BRAND + '<span class="brand-dot">.</span>', BRAND)
        if text != orig:
            with open(path, 'w', encoding='utf-8', newline='\n') as f:
                f.write(text)
            print('updated', os.path.relpath(path, ROOT))
