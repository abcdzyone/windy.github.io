(function () {
  'use strict';

  const card = document.getElementById('weread-dashboard');
  if (!card) return;

  const body = card.querySelector('.weread-body');

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s ?? '';
    return d.innerHTML;
  }

  function render(data) {
    const p = data.platform || {};
    const r = data.reading;
    const f = data.fragments || {};
    const journal = data.journal || [];
    const updated = data.updatedAt
      ? new Date(data.updatedAt).toLocaleString('zh-CN', { hour12: false })
      : '—';

    const statusClass = p.status === 'online' ? 'weread-status-online' : 'weread-status-warn';

    let html = `
      <div class="weread-top">
        <div>
          <h3 class="weread-name">${esc(p.name || 'WeRead Reading Hub')}</h3>
          <p class="weread-meta">快照更新 · ${esc(updated)}</p>
        </div>
        <span class="weread-status ${statusClass}">${p.status === 'online' ? '运行中' : '异常'}</span>
      </div>
      <div class="weread-grid">
    `;

    if (r) {
      html += `
        <div class="weread-panel">
          <span class="weread-panel-label">本周阅读</span>
          <p class="weread-panel-title">${esc(r.weekLabel)}</p>
          <dl class="weread-stats">
            <div><dt>总时长</dt><dd>${r.totalMinutes} min</dd></div>
            <div><dt>日均</dt><dd>${r.dailyAverageMinutes} min</dd></div>
            <div><dt>阅读天数</dt><dd>${r.readDays} 天</dd></div>
          </dl>
          ${r.topBooks?.length ? `<p class="weread-books">在读：${r.topBooks.map(esc).join(' · ')}</p>` : ''}
          ${r.summary ? `<p class="weread-summary">${esc(r.summary)}</p>` : ''}
        </div>
      `;
    }

    html += `
        <div class="weread-panel">
          <span class="weread-panel-label">知识片段</span>
          <p class="weread-big">${f.total ?? '—'}</p>
          <p class="weread-panel-sub">条划线 / 笔记 / 社区摘抄</p>
          <ul class="weread-list">
            ${(f.recent || []).map(item => `
              <li>
                <span class="weread-tag">${esc(item.type)}</span>
                ${item.book ? `<span class="weread-book">${esc(item.book)}</span>` : ''}
                <p>${esc(item.content)}</p>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="weread-panel">
          <span class="weread-panel-label">阅读日志</span>
          <ul class="weread-list weread-journal">
            ${journal.length ? journal.map(j => `
              <li>
                <time>${esc(j.date)}</time>
                <p>${esc(j.content)}</p>
              </li>
            `).join('') : '<li><p class="weread-empty">暂无日志</p></li>'}
          </ul>
          <p class="weread-foot">Skill v${esc(p.skillVersion)}</p>
        </div>
      </div>
    `;

    body.classList.remove('live-loading');
    body.innerHTML = html;
  }

  async function load() {
    try {
      const res = await fetch('./data/weread-public.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      render(await res.json());
    } catch {
      body.classList.remove('live-loading');
      body.innerHTML = '<p class="live-error">阅读数据暂不可用，请稍后再试。</p>';
    }
  }

  load();
})();
