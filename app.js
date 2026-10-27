(function () {
  const D = api.data, S = api.state;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => n.toLocaleString('en-US');
  const wan = (n) => (n / 10000).toFixed(n >= 1e5 ? (n >= 1e6 ? 0 : 1) : 2).replace(/\.0+$/, '') + '万';
  const P = D.PLATFORMS;
  const tierName = (id) => (D.tiers.find((t) => t.id === id) || {}).name || '';

  // ---------- 图标 ----------
  const I = {
    today: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    reply: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/></svg>',
    cards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="3" width="12" height="17" rx="2.5"/><path d="M19 6.5v13a1.5 1.5 0 0 1-1.5 1.5H8"/><path d="M11 9.5c1-1.6 3-1 3 .5 0 1.6-3 3-3 3s-3-1.4-3-3c0-1.5 2-2.1 3-.5z"/></svg>',
    insight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 5v14M5 12h14"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12 20 4l-4 16-4-7z"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="9" width="16" height="11" rx="2"/><path d="M12 9v11M4 13h16M12 9c-2-4-6-3-5-1s5 1 5 1zm0 0c2-4 6-3 5-1s-5 1-5 1z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/></svg>'
  };
  const pet = (n, cls = '') => `<img class="pet ${cls}" src="assets/pet/${n}-256.png" alt="" loading="lazy">`;
  const ic3 = (n, cls = '') => `<img class="ic3 ${cls}" src="assets/icons3d/${n}.png" alt="" loading="lazy">`;
  const askBtn = (q) => `<button class="ask" data-ask="${esc(q)}" title="问一问">${I.spark}</button>`;
  const platTag = (p) => `<span class="plat" style="background:${P[p].color}">${P[p].short}</span>`;
  const av = (t, big) => `<span class="av"${big ? ' style="width:54px;height:54px"' : ''}>${esc(t)}</span>`;

  // ---------- Q 版占位人偶（Codex 素材到位后替换为分层 PNG） ----------
  // Q 版人偶：Codex 交付的分层 PNG（assets/chibi/layers），眼睛跟随鼠标、眨眼、换口型
  const L = (n) => `assets/chibi/layers/${n}.png`;
  function chibi(bust) {
    const eye = (side) => `<div class="m eye-${side}" style="-webkit-mask-image:url(${L('eye-white-' + side)});mask-image:url(${L('eye-white-' + side)})"><img class="pupil" src="${L('pupil-' + side)}" alt=""></div>`;
    return `<div class="chibi rig ${bust ? 'bust' : ''}" aria-hidden="true"><div class="rig-in">
      <img src="${L('hair-back')}" alt=""><img class="body" src="${L('body')}" alt=""><img src="${L('head')}" alt=""><img src="${L('hair-front')}" alt="">
      <img class="ear" src="${L('earrings')}" alt=""><img class="ew" src="${L('eye-white-left')}" alt=""><img class="ew" src="${L('eye-white-right')}" alt="">
      ${eye('left')}${eye('right')}<img class="closed" src="${L('eyes-closed')}" alt="">
      <img src="${L('blush')}" alt=""><img class="mo mo-smile" src="${L('mouth-smile')}" alt=""><img class="mo mo-open" src="${L('mouth-open')}" alt=""><img class="mo mo-o" src="${L('mouth-o')}" alt="">
      <img class="bfly" src="${L('butterfly')}" alt=""><span class="q-think"><i></i><i></i><i></i></span></div></div>`;
  }
  function chibiAct(el, cls, ms = 1600) {
    $$('.chibi', el).concat(el.classList && el.classList.contains('chibi') ? [el] : []).forEach((c) => {
      c.classList.remove(cls); void c.offsetWidth; c.classList.add(cls);
      if (ms) setTimeout(() => c.classList.remove(cls), ms);
    });
  }
  // 眼睛跟随鼠标
  document.addEventListener('mousemove', (e) => {
    $$('.chibi').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || r.bottom < 0 || r.top > innerHeight) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height * (el.classList.contains('bust') ? 0.45 : 0.32);
      const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260) * 1.6;
      $$('.pupil', el).forEach((p) => (p.style.transform = `translate(${(dx / d) * k}%,${(dy / d) * k * 0.8}%)`));
    });
  });
  // 眨眼
  setInterval(() => $$('.chibi').forEach((c) => { c.classList.add('blink'); setTimeout(() => c.classList.remove('blink'), 140); }), 3800);
  document.addEventListener('click', (e) => { const c = e.target.closest('.chibi'); if (c && !e.target.closest('.agent-fab,.qbtn')) { chibiAct(c, 'wave'); chibiAct(c, 'happy', 1000); } });

  // ---------- 导航 ----------
  const VIEWS = [
    { id: 'today', name: '今日', icon: I.today },
    { id: 'reply', name: '回应', icon: I.reply, badge: () => D.comments.filter((c) => c.prio && !S.replied[c.id]).length },
    { id: 'cards', name: '小卡', icon: I.cards },
    { id: 'insight', name: '洞察', icon: I.insight },
    { id: 'more', name: '更多', icon: I.more }
  ];
  let current = 'today';
  function renderNav() {
    $('#nav').innerHTML = VIEWS.map((v) => { const b = v.badge ? v.badge() : 0; return `<button data-view="${v.id}" class="${v.id === current ? 'active' : ''}">${v.icon}<span>${v.name}</span>${b ? `<span class="badge">${b}</span>` : ''}</button>`; }).join('');
    const tb = VIEWS.slice(0, 2).concat([null], VIEWS.slice(2, 4));
    $('#tabbar').innerHTML = tb.map((v) => v ? `<button data-view="${v.id}" class="${v.id === current ? 'active' : ''}">${v.icon}<span>${v.name}</span></button>` : `<button class="qbtn" data-agent aria-label="打开助手">${chibi(1)}</button>`).join('');
  }
  function go(id, opts = {}) {
    current = id;
    $$('.view').forEach((v) => v.classList.toggle('active', v.id === 'v-' + id));
    $('#crumb').textContent = VIEWS.find((v) => v.id === id).name;
    renderNav();
    RENDER[id](opts);
    window.scrollTo(0, 0);
    observe();
    if (agentOpen) setSugs();
  }

  // ---------- 渐显 ----------
  let io;
  function observe() {
    if (!('IntersectionObserver' in window)) { $$('.reveal').forEach((e) => e.classList.add('in')); return; }
    io && io.disconnect();
    io = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); $$('.fill', en.target).forEach((f) => (f.style.width = f.dataset.w)); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    $$('.view.active .reveal:not(.in)').forEach((e) => io.observe(e));
  }

  // ---------- 图表 ----------
  function donut(items, size = 140) {
    const r = 52, c = 2 * Math.PI * r; let off = 0;
    return `<svg class="donut" viewBox="0 0 140 140"><circle cx="70" cy="70" r="${r}" fill="none" stroke="#fff" stroke-width="16"/>${items.map((it) => {
      const len = (it.pct / 100) * c; const s = `<circle cx="70" cy="70" r="${r}" fill="none" stroke="${it.color}" stroke-width="16" stroke-dasharray="${len - 2} ${c - len + 2}" stroke-dashoffset="${-off}" transform="rotate(-90 70 70)"/>`; off += len; return s;
    }).join('')}</svg>`;
  }
  // 平滑曲线（Catmull-Rom 转贝塞尔）
  const smooth = (pts) => pts.map((p, i, a) => {
    if (!i) return `M${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    const p0 = a[i - 2] || a[i - 1], p1 = a[i - 1], p3 = a[i + 1] || p, t = 0.18;
    const c1 = [p1[0] + (p[0] - p0[0]) * t, p1[1] + (p[1] - p0[1]) * t], c2 = [p[0] - (p3[0] - p1[0]) * t, p[1] - (p3[1] - p1[1]) * t];
    return `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  }).join(' ');
  let gid = 0;
  // 状态卡配图：优先用 assets/status/ 新图，没有时退回现有图标
  const stImg = (n, fb) => `<img class="st-img" src="assets/status/${n}.webp" alt="" onerror="this.onerror=null;this.src='assets/${fb}'">`;
  // 图表按容器真实宽度绘制，避免被拉伸变形
  const CH = {};
  const chartBox = (render, w0) => { const id = 'cb' + gid++; CH[id] = render; return `<div class="chart-box" data-ch="${id}" data-w="${w0}">${render(w0)}</div>`; };
  function fitCharts() {
    document.querySelectorAll('.chart-box[data-ch]').forEach((b) => {
      const w = Math.round(b.clientWidth); if (!w || Math.abs(w - +b.dataset.w) < 4 || !CH[b.dataset.ch]) return;
      b.dataset.w = w; b.innerHTML = CH[b.dataset.ch](w);
    });
  }
  let fitRaf = 0; const fitSoon = () => { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fitCharts); };
  window.addEventListener('resize', fitSoon);
  new MutationObserver(fitSoon).observe(document.body, { childList: true, subtree: true });
  // 数据点很多时做轻度平滑（3 点滑动平均），只影响曲线形状
  const soften = (a) => a.length < 40 ? a : a.map((v, i) => { const w = a.slice(Math.max(0, i - 2), i + 3); return w.reduce((m, x) => m + x, 0) / w.length; });
  function lineChart(data) { return chartBox((w) => lineChartSvg(data, w), 520); }
  function lineChartSvg(data, W) {
    const H = 230, pad = 30, max = Math.max(...data.map((d) => d.v)) * 1.15, id = 'lc' + gid++;
    const x = (i) => pad + (i * (W - pad * 2)) / (data.length - 1), y = (v) => H - pad - (v / max) * (H - pad * 2);
    const pts = data.map((d, i) => [x(i), y(d.v)]), path = smooth(pts), last = pts[pts.length - 1];
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
      <defs><linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB8EC" stop-opacity=".38"/><stop offset=".6" stop-color="#C9C4F2" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9AA6EE"/><stop offset="1" stop-color="#3C9CFA"/></linearGradient></defs>
      ${[0.25, 0.5, 0.75].map((f) => `<line x1="${pad}" x2="${W - pad}" y1="${pad + f * (H - pad * 2)}" y2="${pad + f * (H - pad * 2)}" stroke="#E6EDF5" stroke-dasharray="3 5"/>`).join('')}
      <path d="${path} L${x(data.length - 1)} ${H - pad} L${pad} ${H - pad}Z" fill="url(#${id}a)"/>
      <path d="${path}" fill="none" stroke="url(#${id}s)" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="${last[0]}" cy="${last[1]}" r="9" fill="#3C9CFA" opacity=".15"/><circle cx="${last[0]}" cy="${last[1]}" r="4.5" fill="#fff" stroke="#3C9CFA" stroke-width="2.4"/>
      ${data.map((d, i) => `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#8E9BAD" font-family="Jost">${d.d}</text>`).join('')}
      <text x="${last[0] - 8}" y="${last[1] - 14}" text-anchor="end" font-size="12" fill="#2A6F9F" font-family="Jost">${data[data.length - 1].v}k · 正向 ${Math.round(data[data.length - 1].pos * 100)}%</text>
    </svg>`;
  }
  const bars = (items, max) => `<div class="bars">${items.map((it) => `<div class="bar"><span>${esc(it.k)}</span><div class="track"><div class="fill" data-w="${(it.v / max) * 100}%"></div></div><span class="num">${it.v}%</span></div>`).join('')}</div>`;

  // 进度阶梯（参考 Achievement Tiers）：steps=[{name,sub}], at=当前所在下标, prog=到下一级的进度 0-1
  function stepper(steps, at, prog = 0.5, label = '') {
    const pct = ((at + Math.min(prog, 0.98)) / (steps.length - 1)) * 100;
    return `<div class="stepper">${label ? `<div class="st-lbl">${label}</div>` : ''}<div class="st-track"><div class="st-fill" style="--p:${Math.min(pct, 100)}%"></div>
      ${steps.map((st, i) => `<i class="${i < at ? 'done' : i === at ? 'cur' : ''}" style="left:${(i / (steps.length - 1)) * 100}%"></i>`).join('')}</div>
      <div class="st-names">${steps.map((st, i) => `<div class="${i === at ? 'cur' : ''}" style="left:${(i / (steps.length - 1)) * 100}%"><b>${st.name}</b><small>${st.sub}</small></div>`).join('')}</div></div>`;
  }
  const TIER_STEPS = [{ name: '初遇', sub: '第一次留言' }, { name: '常伴', sub: '每月常来' }, { name: '长情', sub: '陪伴满 3 年' }, { name: '共创', sub: '投稿作品' }];
  const tierIdx = (id) => ['chuyu', 'changban', 'changqing', 'gongchuang'].indexOf(id);

  // ---------- 涨粉看板 ----------
  let gRange = 30, gMode = 'plat';
  function multiLine(labels, list) { return chartBox((w) => multiLineSvg(labels, list, w), 640); }
  function multiLineSvg(labels, list0, W) {
    const list = list0.map((l) => ({ ...l, data: soften(l.data) }));
    const H = 260, pl = 46, pr = 16, pt = 18, pb = 30;
    const max = Math.max(...list.flatMap((l) => l.data)) * 1.12;
    const x = (i) => pl + (i * (W - pl - pr)) / (labels.length - 1), y = (v) => H - pb - (v / max) * (H - pt - pb);
    const step = Math.ceil(labels.length / Math.max(4, Math.min(10, Math.floor(W / 110))));
    const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => { const v = max * f, yy = y(v); return `<line x1="${pl}" x2="${W - pr}" y1="${yy}" y2="${yy}" stroke="#E6EDF5" ${f ? 'stroke-dasharray="3 5"' : ''}/><text x="${pl - 8}" y="${yy + 4}" text-anchor="end" font-size="10" fill="#9AAAB5" font-family="Jost">${v >= 10000 ? (v / 10000).toFixed(1) + 'w' : Math.round(v / 100) / 10 + 'k'}</text>`; }).join('');
    const id = 'ml' + gid++;
    const defs = `<defs>${list.map((l, li) => `<linearGradient id="${id}${li}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${l.color}" stop-opacity="${list.length === 1 ? 0.35 : 0.22}"/><stop offset="1" stop-color="${l.color}" stop-opacity="0"/></linearGradient>`).join('')}</defs>`;
    const lines = defs + list.map((l, li) => { const pts = l.data.map((v, i) => [x(i), y(v)]), d = smooth(pts), lp = pts[pts.length - 1];
      return `<path d="${d} L${lp[0]} ${H - pb} L${pl} ${H - pb}Z" fill="url(#${id}${li})"/><path d="${d}" fill="none" stroke="${l.color}" stroke-width="${list.length === 1 ? 2.4 : 1.8}" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${lp[0]}" cy="${lp[1]}" r="3.5" fill="#fff" stroke="${l.color}" stroke-width="2"/>`; }).join('');
    const xl = labels.map((t, i) => (i % step === 0 || i === labels.length - 1) ? `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="10" fill="#9AAAB5" font-family="Jost">${t}</text>` : '').join('');
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${grid}${lines}${xl}</svg>`;
  }
  function growthHTML() {
    const g = D.growth[gRange], ids = ['wb', 'dy', 'xhs', 'mp'];
    const sum = (a) => a.reduce((m, v) => m + v, 0);
    const tot = g.labels.map((_, i) => ids.reduce((m, id) => m + g[id][i], 0));
    const list = gMode === 'all' ? [{ name: '全平台', color: '#3C9CFA', data: tot }] : ids.map((id) => ({ name: P[id].name, color: P[id].color, data: g[id] }));
    const rows = ids.map((id) => { const n = sum(g[id]), prev = n * g.prevRatio[id]; return { id, n, mom: Math.round((n / prev - 1) * 100), rate: (n / D.overview.platforms.find((p) => p.id === id).fans) * 100 }; });
    const allN = sum(tot), maxN = Math.max(...rows.map((r) => r.n));
    return `<div class="panel">${askBtn('最近涨粉主要来自哪里？')}
        <div class="g-head"><div><h3>涨粉趋势</h3><div class="muted" style="font-size:12px">纵向对比 · 每日新增粉丝</div></div>
          <div class="seg">${[7, 30, 90].map((n) => `<button data-grange="${n}" class="${gRange === n ? 'on' : ''}">${n} 天</button>`).join('')}</div>
          <div class="seg">${[['plat', '分平台'], ['all', '全平台']].map(([k, n]) => `<button data-gmode="${k}" class="${gMode === k ? 'on' : ''}">${n}</button>`).join('')}</div></div>
        <div class="g-total"><span class="num">+${fmt(allN)}</span><small>近 ${gRange} 天全平台新增 · 环比 +${Math.round((allN / rows.reduce((m, r) => m + r.n * D.growth[gRange].prevRatio[r.id], 0) - 1) * 100)}%</small></div>
        ${multiLine(g.labels, list)}
        ${gMode === 'plat' ? `<div class="plat-legend" style="justify-content:center">${ids.map((id) => `<span><i style="background:${P[id].color}"></i>${P[id].name}</span>`).join('')}</div>` : ''}</div>
      <div class="panel">${askBtn('各平台涨粉速度为什么不一样？')}<h3>平台对比</h3><div class="muted" style="font-size:12px">横向对比 · 近 ${gRange} 天</div>
        <div class="cmp">${rows.sort((a, b) => b.n - a.n).map((r) => `<div class="cmp-row"><div class="cmp-top">${platTag(r.id)}<b>${P[r.id].name}</b><span class="num">+${fmt(r.n)}</span><span class="mom ${r.mom >= 0 ? 'up' : 'down'}">${r.mom >= 0 ? '↑' : '↓'} ${Math.abs(r.mom)}%</span></div>
          <div class="track"><div class="fill" style="width:${(r.n / maxN) * 100}%;background:${P[r.id].color}"></div></div>
          <div class="cmp-sub">占新增 ${Math.round((r.n / allN) * 100)}% · 粉丝增长率 ${r.rate.toFixed(2)}%</div></div>`).join('')}</div></div>`;
  }

  // ---------- 今日 ----------
  const slides = [
    { cls: 's1', big: '心之所向', sub: '今日 1,286 条留言 · 3 条值得你看' },
    { cls: 's2', big: 'YUNXIU', sub: '《云秀行》下周首播 · 312 位粉丝在期待' },
    { cls: 's3', big: 'THANK YOU', sub: '本周收到 12 件粉丝创作' }
  ];
  // 首页大号宠物「雾蝶」：点一下换动作，并说一句今天的提醒
  const PET_LINES = [
    ['wave', '早上好，一桐！今天有 3 条留言值得你看～'],
    ['heart', '晚风来信今天生日，记得给 TA 写几句哦'],
    ['cheer', '今天新增 1.23 万位粉丝，抖音涨得最快！'],
    ['card', '还有 1 张小卡等你送出'],
    ['mic', '《云秀行》首播夜，要不要开一场直播？'],
    ['listen', '想知道粉丝在聊什么？问问小桐吧'],
    ['think', '我在想……下周发什么内容好呢'],
    ['sleep', 'Zzz……（偷偷打了个盹）']
  ];
  let petI = 0;
  // 雾蝶支持拖动：按住拖到任意位置，松手后记住；轻点仍是换动作
  const PET_KEY = 'yt-pet-pos';
  let petDragged = false;
  function placePet(st) {
    if (!st || st.dataset.placed) return; st.dataset.placed = 1;
    try { const v = JSON.parse(localStorage.getItem(PET_KEY) || 'null'); if (v) { st.style.left = (v.x * 100) + '%'; st.style.top = v.y + 'px'; st.style.right = 'auto'; } } catch (e) {}
  }
  new MutationObserver(() => placePet(document.querySelector('.pet-stage'))).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('pointerdown', (e) => {
    const st = e.target.closest('.pet-stage'); if (!st || e.button > 0) return;
    const par = st.offsetParent || st.parentElement, r0 = st.getBoundingClientRect();
    const ox = e.clientX - r0.left, oy = e.clientY - r0.top, sx = e.clientX, sy = e.clientY;
    petDragged = false;
    const move = (ev) => {
      if (!petDragged && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
      if (!petDragged) { petDragged = true; st.classList.add('dragging'); try { st.setPointerCapture(e.pointerId); } catch (_) {} }
      ev.preventDefault();
      const pr2 = par.getBoundingClientRect();
      const x = Math.min(Math.max(ev.clientX - pr2.left - ox, -20), pr2.width - st.offsetWidth + 20);
      const y = Math.min(Math.max(ev.clientY - pr2.top - oy, -40), pr2.height - st.offsetHeight + 40);
      st.style.left = x + 'px'; st.style.top = y + 'px'; st.style.right = 'auto';
    };
    const up = () => {
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up);
      st.classList.remove('dragging');
      if (petDragged) { const w = par.getBoundingClientRect().width; try { localStorage.setItem(PET_KEY, JSON.stringify({ x: st.offsetLeft / w, y: st.offsetTop })); } catch (_) {} }
    };
    document.addEventListener('pointermove', move, { passive: false }); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up);
  });
  // 拖动结束时不触发"换动作"
  document.addEventListener('click', (e) => { if (petDragged && e.target.closest('.pet-stage')) { e.stopImmediatePropagation(); e.preventDefault(); petDragged = false; } }, true);
  function petNext() {
    const img = $('#petBig'), bub = $('#petBubble'); if (!img) return;
    petI = (petI + 1) % PET_LINES.length; const [n, line] = PET_LINES[petI];
    img.classList.remove('pop'); void img.offsetWidth; img.src = `assets/pet/${n}.png`; img.classList.add('pop');
    bub.classList.remove('show'); void bub.offsetWidth; bub.textContent = line; bub.classList.add('show'); clearTimeout(bub._t); bub._t = setTimeout(() => { if (innerWidth <= 860) bub.classList.remove('show'); }, 3200);
  }
  let slideI = 0, slideT;
  function renderToday() {
    const o = D.overview, pending = D.comments.filter((c) => c.prio && !S.replied[c.id]);
    const maxK = Math.max(...D.keywords.map((k) => k.n));
    $('#v-today').innerHTML = `
      <div class="hero-wrap"><div class="hero">
        ${slides.map((s, i) => `<div class="slide ${s.cls} ${i === slideI ? 'on' : ''}"><div class="big">${s.big}</div><div class="sub">${s.sub}</div></div>`).join('')}
        <button class="hero-arrow l" data-slide="-1" aria-label="上一张">${I.left}</button>
        <button class="hero-arrow r" data-slide="1" aria-label="下一张">${I.right}</button>
        <div class="dots">${slides.map((s, i) => `<i class="${i === slideI ? 'on' : ''}"></i>`).join('')}</div>
      </div></div>

      <div class="greet">
        <div>
          <h1 class="greet-title">Good morning,<br><span>一桐</span></h1>
          <div class="greet-brief"><div class="mini-chibi" data-agent>${stImg('brief','pet/idle-256.png')}</div>
            <p>今天有 <b>${pending.length} 条</b>值得你看的留言，<b>2 位</b>粉丝过生日，全平台粉丝新增 <b>${wan(o.todayNew)}</b>。大家最关心的是《云秀行》下周首播。</p></div>
        </div>
        <div class="stack-wrap">
          <div class="stack">${pending.slice(0, 3).map((c) => `<span class="av" title="${esc(c.fan)}">${esc(c.av)}</span>`).join('')}<button class="plus" data-view="reply" aria-label="查看全部待回应">${I.plus}</button></div>
          <div class="stack" style="margin-top:22px"><div class="stack-labels" style="margin-left:4px"><span>Waiting<br>for you</span><span>Special<br>people</span></div></div>
        </div>
        <div class="pills">
          <div class="pill on" role="button" tabindex="0" data-drawer="pending"><div class="thumb">${stImg('pending','icons3d/reply.png')}</div><div class="lbl"><b class="num">${pending.length}</b>待回应</div>${askBtn('今天哪些留言最值得我回？')}</div>
          <div class="pill" role="button" tabindex="0" data-drawer="risky"><div class="thumb">${stImg('risky','icons3d/review.png')}</div><div class="lbl"><b class="num">${D.risky.length}</b>棘手消息</div>${askBtn('棘手消息我该怎么处理？')}</div>
          <div class="pill" role="button" tabindex="0" data-view="more" data-tab="bday"><div class="thumb">${stImg('birthday','icons3d/birthday.png')}</div><div class="lbl"><b class="num">2</b>今日生日</div>${askBtn('今天谁过生日？')}</div>
          <div class="pill" role="button" tabindex="0" data-view="cards"><div class="thumb">${stImg('card','icons3d/card.png')}</div><div class="lbl"><b class="num">1</b>待送小卡</div>${askBtn('帮我做一张长情小卡')}</div>
        </div>
        <div class="pet-stage" role="button" tabindex="0" data-pet title="点我换个动作">
          <div class="pet-bubble" id="petBubble">${PET_LINES[0][1]}</div>
          <img class="pet-big" id="petBig" src="assets/pet/${PET_LINES[0][0]}.png" alt="雾蝶">
          <div class="pet-shadow"></div>
        </div>
        <div class="ghost-word">Yitong</div>
      </div>

      <div class="sec reveal">
        <div class="sec-head"><h2><em>01</em>今天的数据</h2><span class="muted" style="font-size:12px">同步于 ${o.syncedAt}</span></div>
        <div class="kpis">
          <div class="panel kpi">${askBtn('解释一下今天的涨粉情况')}<div class="k">全平台粉丝</div><div class="v num">${fmt(o.totalFans)}</div>
            <div class="plat-bars">${o.platforms.map((p) => `<i style="flex:${p.fans};background:${P[p.id].color}"></i>`).join('')}</div>
            <div class="plat-legend">${o.platforms.map((p) => `<span><i style="background:${P[p.id].color}"></i>${P[p.id].name} ${wan(p.fans)}</span>`).join('')}</div></div>
          <div class="panel kpi kpi-a">${ic3('star')}<div class="k">今日新增</div><div class="v num">+${fmt(o.todayNew)}</div><div class="d">较昨日 +18%</div></div>
          <div class="panel kpi kpi-b">${ic3('reply')}<div class="k">今日留言</div><div class="v num">${fmt(o.todayComments)}</div><div class="d">AI 已筛出 ${D.comments.length} 条精选</div></div>
          <div class="panel kpi">${ic3('send')}<div class="k">今日已回应</div><div class="v num" id="kpiReplied">${Object.keys(S.replied).length}<small>次</small></div><div class="d">每一次都由你亲自确认</div></div>
        </div>
        <div class="growth" id="growth">${growthHTML()}</div>
        <div class="five">${o.fiveThings.map((f) => `<button data-ask="粉丝在聊「${esc(f.t)}」，具体说了什么？"><span class="n">${f.n}</span>${esc(f.t)}</button>`).join('')}</div>
      </div>

      <div class="sec reveal">
        <div class="sec-head"><h2><em>02</em>粉丝在聊</h2></div>
        <div class="two">
          <div class="panel">${askBtn('这些关键词说明了什么？')}<h3>高频关键词</h3><div class="muted" style="font-size:12px">点一个词，看相关留言</div>
            <div class="cloud">${D.keywords.map((k) => `<button data-kw="${esc(k.w)}" style="font-size:${14 + (k.n / maxK) * 30}px;opacity:${0.45 + (k.n / maxK) * 0.55}">${esc(k.w)}</button>`).join('')}</div></div>
          <div class="panel">${askBtn('最近一周互动为什么上涨？')}<h3>近 7 天互动与情绪</h3><div class="muted" style="font-size:12px">互动量（千） · 正向情绪占比</div>${lineChart(o.trend)}</div>
        </div>
      </div>

      <div class="sec reveal">
        <div class="sec-head"><h2><em>03</em>粉丝分布</h2><button class="btn ghost sm" data-view="insight">完整洞察 ${I.right}</button></div>
        <div class="three">
          <div class="panel">${askBtn('平台之间的粉丝有什么不同？')}<h3>平台占比</h3><div class="donut-wrap">${donut(o.platforms.map((p) => ({ pct: (p.fans / o.totalFans) * 100, color: P[p.id].color })))}<div class="legend">${o.platforms.map((p) => `<div><i style="background:${P[p.id].color}"></i>${P[p.id].name}<span class="num">${Math.round((p.fans / o.totalFans) * 100)}%</span></div>`).join('')}</div></div></div>
          <div class="panel">${askBtn('各分层粉丝该怎么维护？')}<h3>陪伴分层 <small class="muted" style="font-weight:400;font-size:11px">对应纪念卡</small></h3><div class="donut-wrap">${donut(D.tiers)}<div class="legend">${D.tiers.map((t) => `<div><i style="background:${t.color}"></i>${t.name}<span class="num">${t.pct}%</span></div>`).join('')}</div></div></div>
          <div class="panel">${askBtn('粉丝主要是哪些年龄段？')}<h3>年龄分布</h3>${bars(D.audience.age, 45)}</div>
        </div>
      </div>

      <div class="sec reveal">
        <div class="sec-head"><h2><em>04</em>快速回应</h2><button class="btn ghost sm" data-view="reply">全部留言 ${I.right}</button></div>
        <div class="hscroll">${D.comments.filter((c) => c.prio || c.likes > 1000).map((c) => qcard(c)).join('')}</div>
      </div>

      <div class="sec reveal">
        <div class="sec-head"><h2><em>05</em>棘手消息与私信</h2><span class="muted" style="font-size:12px">内容默认模糊，点击后显示</span></div>
        <div class="risk-grid">${D.risky.map(riskCard).join('')}
          <div class="panel white">${askBtn('私信里有什么需要我注意的？')}<h3>新私信</h3>${D.dms.map((d) => `<button class="dm" data-dm="${d.id}">${av(d.av)}<div><b style="font-weight:500">${esc(d.fan)}</b> ${platTag(d.p)}<p>${esc(d.text)}</p></div></button>`).join('')}</div>
        </div>
      </div>

      <div class="sec reveal">
        <div class="sec-head"><h2><em>06</em>内容灵感</h2></div>
        <div class="ideas">${D.ideas.map((i) => `<div class="idea"><b>${esc(i.t)}</b><span>${esc(i.why)}</span><button class="btn soft sm" data-ask="帮我策划「${esc(i.t)}」">${I.spark}让助手策划</button></div>`).join('')}</div>
      </div>`;
    clearInterval(slideT); slideT = setInterval(() => slide(1), 5200);
  }
  function slide(d) {
    const ss = $$('#v-today .slide'); if (!ss.length) return;
    slideI = (slideI + d + ss.length) % ss.length;
    ss.forEach((s, i) => s.classList.toggle('on', i === slideI));
    $$('#v-today .dots i').forEach((s, i) => s.classList.toggle('on', i === slideI));
  }
  function qcard(c) {
    return `<div class="qcard ${S.replied[c.id] ? 'done' : ''}">${askBtn('帮我回复「' + c.fan + '」')}
      <div class="who">${av(c.av)}<div><b>${esc(c.fan)}</b> ${platTag(c.p)}<small>${tierName(c.tier)} · 陪伴 ${c.days} 天</small></div></div>
      <div class="sum">${esc(c.sum)}</div><div class="draft">${esc(c.draft)}</div>
      <div class="row"><span class="muted" style="font-size:11px">♡ ${fmt(c.likes)}</span><button class="btn sm" data-comment="${c.id}">${S.replied[c.id] ? '已回应' : '查看并回应'}</button></div></div>`;
  }
  function riskCard(r) {
    return `<div class="risk" id="risk-${r.id}"><div class="head">${platTag(r.p)}${esc(r.kind)} · ${r.time}<span class="tag rose">风险 ${r.level}</span></div>
      <div class="txt">${esc(r.text)}</div><button class="reveal-btn" data-reveal="${r.id}">显示内容</button>
      <div class="adv"><b>建议：</b>${esc(r.advice)}</div>
      <div class="acts"><button class="btn ghost sm" data-risk="${r.id}" data-act="evidence">截图留证</button><button class="btn ghost sm" data-risk="${r.id}" data-act="studio">转交工作室</button><button class="btn danger sm" data-risk="${r.id}" data-act="ignore">不回应</button></div></div>`;
  }

  // ---------- 回应 ----------
  const CATS = ['全部', '高优', '情感', '工作学业', '角色讨论', '创作', '心愿', '需谨慎'];
  let replyCat = '全部', replyQ = '', replyKw = '';
  async function renderReply(opts = {}) {
    if (opts.kw !== undefined) { replyKw = opts.kw; replyCat = '全部'; }
    if (opts.cat) replyCat = opts.cat;
    const v = $('#v-reply');
    v.innerHTML = `<div class="sec-head" style="margin-top:20px"><h2><em>REPLY</em>留言与回应</h2><span class="muted" style="font-size:12px">AI 已从 1,286 条中按主题整理</span></div>
      <div class="filters">${CATS.map((c) => `<button class="chip ${c === replyCat ? 'active' : ''}" data-cat="${c}">${c}${c === '需谨慎' ? ` · ${D.risky.length}` : ''}</button>`).join('')}
        ${replyKw ? `<button class="chip active" data-kwclear>关键词：${esc(replyKw)} ✕</button>` : ''}
        <label class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input id="replyQ" placeholder="搜索昵称或内容" value="${esc(replyQ)}"></label></div>
      <div id="clist"></div>
      <div class="sent-log"><div class="sec-head"><h2 style="font-size:17px">发送记录</h2></div><div id="sentLog"></div></div>`;
    await fillReplyList();
    renderSentLog();
    $('#replyQ').addEventListener('input', (e) => { replyQ = e.target.value; fillReplyList(); });
  }
  async function fillReplyList() {
    const el = $('#clist'); if (!el) return;
    if (replyCat === '需谨慎') { el.className = 'risk-grid'; el.style.marginTop = '22px'; el.innerHTML = D.risky.map(riskCard).join(''); return; }
    el.className = 'clist'; el.style.marginTop = '';
    const list = await api.searchComments({ cat: replyCat, kw: replyKw, q: replyQ });
    el.innerHTML = list.length ? list.map((c) => `<button class="citem ${S.replied[c.id] ? 'replied' : ''}" data-comment="${c.id}">
      <div class="who">${av(c.av)}<div><b>${esc(c.fan)}</b><div class="muted" style="font-size:11px">${tierName(c.tier)} · 陪伴 ${c.days} 天</div></div><span class="time">${c.time}</span></div>
      <p>${esc(c.text)}</p><div class="why">✦ ${esc(c.why)}</div>
      <div class="meta">${platTag(c.p)}<span class="tag">${c.cat}</span>${c.prio ? '<span class="tag rose">高优</span>' : ''}<span class="likes">♡ ${fmt(c.likes)}</span></div></button>`).join('')
      : '<div class="muted" style="padding:40px;text-align:center">没有匹配的留言</div>';
  }
  function renderSentLog() {
    const el = $('#sentLog'); if (!el) return;
    el.innerHTML = S.sent.length ? S.sent.slice(0, 8).map((s) => { const c = api.getComment(s.id) || {}; return `<div class="sent-row">${av(c.av || '·')}<b style="font-weight:500">${esc(c.fan || '')}</b><span class="t">${s.voice ? '🎙 语音 · ' : ''}${esc(s.text || '')}</span><span class="tag">${esc(s.channel)}</span>${s.card ? '<span class="tag">附小卡</span>' : ''}</div>`; }).join('')
      : '<div class="muted" style="font-size:13px">还没有发送记录。挑一条留言开始吧。</div>';
  }

  // ---------- 抽屉：留言详情与回复 ----------
  let rec = null, recBlob = null, attachedCard = null;
  function openDrawer(title, html) {
    $('#drawerTitle').textContent = title; $('#drawerBody').innerHTML = html;
    $('#drawer').classList.add('on'); $('#scrim').classList.add('on');
    $('#drawerBody').scrollTop = 0;
    // 助手开着时：宽屏把抽屉放在助手左边，窄屏先收起助手，避免叠在一起
    if (agentOpen) { if (innerWidth >= 1100) $('#drawer').classList.add('beside'); else closeAgent(); }
  }
  function closeDrawer() { $('#drawer').classList.remove('on'); $('#scrim').classList.remove('on'); stopRec(); }
  function openComment(id) {
    const c = api.getComment(id); if (!c) return;
    ctxComment = c; recBlob = null; attachedCard = null;
    const channels = [`${P[c.p].name}评论回复`, `${P[c.p].name}私信`, '小程序站内'];
    openDrawer('认识这份陪伴', `
      <div class="fan-head">${av(c.av, 1)}<div><b>${esc(c.fan)}</b> ${platTag(c.p)}<small>${tierName(c.tier)} · 首次互动 ${c.firstSeen} · ♡ ${fmt(c.likes)}</small></div></div>
      <div class="quote">${esc(c.text)}</div>
      <div class="stats3"><div><b>${c.days}</b><span>陪伴天数</span></div><div><b>${c.total}</b><span>累计留言</span></div><div><b>${c.history.length}</b><span>重要时刻</span></div></div>
      ${stepper(TIER_STEPS, tierIdx(c.tier), Math.min(c.days / 1100, 0.9), `陪伴阶梯 · 已陪伴 ${fmt(c.days)} 天`)}
      <ul class="tl">${c.history.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <div class="composer">
        <div class="composer-top">${I.spark.replace('<svg', '<svg width="14" height="14" style="color:#1A6FD0"')}按你的口吻起草 · 可以随意修改<button class="regen" id="regen">换一种说法</button></div>
        <textarea id="replyText" placeholder="写下你想说的话…"></textarea>
        <div class="hint">${c.draft.includes('【') ? '<mark>【】</mark> 里的内容需要你补上真实经历，AI 不会替你编造。' : '草稿只是参考，最后的话由你来说。'}</div>
        <div class="tools"><button class="voice" id="recBtn">${I.mic}<span>录一段语音</span></button><span id="recOut"></span>
          <button class="btn ghost sm" id="attachBtn">${I.gift}附一张小卡</button></div>
        <div id="attachOut"></div>
      </div>
      <div class="channels">${channels.map((ch, i) => `<button class="chip ${i === 0 ? 'active' : ''}" data-ch="${esc(ch)}">${esc(ch)}</button>`).join('')}</div>
      <div class="send-row"><span class="muted" style="font-size:12px">发送前由你确认 · 不会自动发出</span><button class="btn" id="sendBtn">${I.send}确认发送</button></div>`);
    typeInto($('#replyText'), c.draft);
    $('#regen').onclick = () => typeInto($('#replyText'), altDraft(c));
    $('#recBtn').onclick = toggleRec;
    $('#attachBtn').onclick = () => {
      const th = D.cardThemes.find((t) => t.id === c.tier) || D.cardThemes[0];
      attachedCard = { theme: th.id, to: c.fan };
      $('#attachOut').innerHTML = `<div class="attach"><div class="mini ycard t-${th.id}"></div><div style="flex:1;font-size:12px"><b style="font-weight:500">「${th.name}」纪念卡</b><div class="muted">按 ${esc(c.fan)} 的陪伴自动推荐</div></div><button class="btn ghost sm" data-view="cards" data-for="${c.id}">去工坊定制</button></div>`;
    };
    $$('#drawerBody [data-ch]').forEach((b) => (b.onclick = () => { $$('#drawerBody [data-ch]').forEach((x) => x.classList.toggle('active', x === b)); }));
    $('#sendBtn').onclick = async () => {
      const text = $('#replyText').value.trim();
      if (!text && !recBlob) return toast('先写几句话，或录一段语音');
      const channel = $('#drawerBody [data-ch].active').dataset.ch;
      await api.sendReply({ id: c.id, text, voice: recBlob, channel, card: attachedCard });
      closeDrawer(); toast(`已通过「${channel}」发送给 ${c.fan}`);
      celebrate(attachedCard ? 'give' : 'happy');
      refreshCounts();
    };
  }
  function altDraft(c) {
    const alts = {
      c1: '谢谢你愿意告诉我这些。一个人在新城市，加班回家的路上有首歌陪着，真好。辛苦了，记得好好吃饭。',
      c2: '面试前紧张很正常，说明你很在乎。【写一句你自己会对自己说的话】你已经准备了很久，相信那个准备好的自己。',
      c3: '被你发现啦！那场戏的秘密在【一个具体的小细节】。下次直播的时候详细讲给你们听。'
    };
    return alts[c.id] || c.draft.split('。').slice(0, 2).join('。') + '。谢谢你。';
  }
  let typeT;
  function typeInto(el, text) {
    clearInterval(typeT); el.value = ''; el.classList.add('typing'); let i = 0;
    typeT = setInterval(() => { el.value = text.slice(0, (i += 2)); if (i >= text.length) { clearInterval(typeT); el.value = text; el.classList.remove('typing'); } }, 18);
  }
  async function toggleRec() {
    const btn = $('#recBtn');
    if (rec && rec.state === 'recording') { stopRec(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = []; rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = () => { stream.getTracks().forEach((t) => t.stop()); recBlob = new Blob(chunks, { type: 'audio/webm' }); const o = $('#recOut'); if (o) o.innerHTML = `<audio controls src="${URL.createObjectURL(recBlob)}"></audio>`; if (btn) { btn.classList.remove('rec'); btn.innerHTML = I.mic + '<span>重新录制</span>'; } };
      rec.start(); btn.classList.add('rec'); btn.innerHTML = '<span class="wave"><i></i><i></i><i></i><i></i><i></i></span><span>录音中，点击结束</span>';
    } catch (e) {
      // 无麦克风权限时模拟一段录音，保证演示流程可以继续
      btn.classList.add('rec'); btn.innerHTML = '<span class="wave"><i></i><i></i><i></i><i></i><i></i></span><span>录音中…</span>';
      setTimeout(() => { if (!btn.isConnected) return; recBlob = new Blob(['demo'], { type: 'audio/webm' }); btn.classList.remove('rec'); btn.innerHTML = I.mic + '<span>重新录制</span>'; const o = $('#recOut'); if (o) o.innerHTML = '<span class="tag">🎙 语音 0:08</span>'; }, 1800);
    }
  }
  function stopRec() { if (rec && rec.state === 'recording') rec.stop(); }
  function openList(title, list) {
    openDrawer(title, list.length ? `<div class="clist" style="grid-template-columns:1fr;margin-top:0">${list.map((c) => `<button class="citem ${S.replied[c.id] ? 'replied' : ''}" data-comment="${c.id}"><div class="who">${av(c.av)}<div><b>${esc(c.fan)}</b><div class="muted" style="font-size:11px">${tierName(c.tier)} · ${P[c.p].name}</div></div><span class="time">${c.time}</span></div><p>${esc(c.text)}</p><div class="why">✦ ${esc(c.why)}</div></button>`).join('')}</div>` : '<div class="muted">暂无相关留言</div>');
  }

  // ---------- 小卡工坊 ----------
  const W = { src: 'tpl', style: 'watercolor', photo: null, theme: 'changqing', to: 'c1', tier: '', hand: '谢谢你，一直在。', ai: true, n: 128 };
  let camStream = null;
  function renderCards(opts = {}) {
    if (opts.for) { const c = api.getComment(opts.for); W.to = c.id; W.theme = c.tier; W.tier = ''; }
    if (opts.tier) { W.tier = opts.tier; W.theme = opts.tier; }
    const v = $('#v-cards');
    v.innerHTML = `<div class="sec-head" style="margin-top:20px"><h2><em>CARDS</em>小卡工坊</h2><span class="muted" style="font-size:12px">一张只属于 TA 的纪念</span></div>
      <div class="workshop"><div>
        <div class="step"><h3><i>1</i>选一张照片</h3>
          <div class="src-tabs">${[['tpl', '模板'], ['upload', '上传照片'], ['cam', '现场自拍']].map(([k, n]) => `<button class="chip ${W.src === k ? 'active' : ''}" data-src="${k}">${n}</button>`).join('')}</div>
          <div id="srcBox"></div></div>
        <div class="step"><h3><i>2</i>让模型套一层风格</h3>
          <div class="style-row">${D.portraitStyles.map((s) => `<button class="chip ${W.style === s.id ? 'active' : ''}" data-style="${s.id}">${s.name}</button>`).join('')}</div>
          <div class="muted" style="font-size:12px;margin-top:10px">AI 处理过的照片会自动加上「AI 生成」标识</div></div>
        <div class="step"><h3><i>3</i>选纪念主题，写一句话</h3>
          <div class="theme-row">${D.cardThemes.map((t) => `<button class="theme-btn ${W.theme === t.id ? 'on' : ''}" data-theme="${t.id}">${t.name}<small>${tierName(t.id) && D.tiers.find((x) => x.id === t.id).desc}</small></button>`).join('')}</div>
          <label class="field">手写寄语<input id="handIn" maxlength="20" value="${esc(W.hand)}"></label></div>
        <div class="step"><h3><i>4</i>送给谁</h3>
          <label class="field">单个粉丝<select id="toSel">${D.comments.map((c) => `<option value="${c.id}" ${W.to === c.id ? 'selected' : ''}>${esc(c.fan)} · ${tierName(c.tier)} · 陪伴 ${c.days} 天</option>`).join('')}</select></label>
          <label class="field">或者送给一整层粉丝<select id="tierSel"><option value="">不批量</option>${D.tiers.map((t) => `<option value="${t.id}" ${W.tier === t.id ? 'selected' : ''}>全部「${t.name}」粉丝（约 ${t.pct}%）</option>`).join('')}</select></label>
          <div style="display:flex;gap:10px;margin-top:18px"><button class="btn ghost" id="previewBtn">看看 TA 收到的样子</button><button class="btn" id="giveBtn">${I.gift}送出小卡</button></div></div>
      </div>
      <div class="preview-col"><div id="cardPreview"></div>
        ${S.cards.length ? `<div class="muted" style="font-size:12px;margin-top:22px">已送出 ${S.cards.length} 张</div><div class="sent-cards">${S.cards.slice(0, 6).map((k) => cardHTML(k, true)).join('')}</div>` : ''}</div></div>`;
    renderSrc(); renderPreview();
    $('#handIn').addEventListener('input', (e) => { W.hand = e.target.value; renderPreview(); });
    $('#toSel').addEventListener('change', (e) => { W.to = e.target.value; renderPreview(); });
    $('#tierSel').addEventListener('change', (e) => { W.tier = e.target.value; renderPreview(); });
    $('#previewBtn').onclick = phonePreview;
    $('#giveBtn').onclick = giveCard;
  }
  function renderSrc() {
    const box = $('#srcBox'); stopCam();
    if (W.src === 'tpl') {
      box.innerHTML = `<div class="tpl-grid">${D.portraitStyles.map((s) => `<button class="tpl ${W.photo === s.img ? 'on' : ''}" data-tpl="${s.img}" style="background-image:url(${s.img}),linear-gradient(160deg,#ECF5FB,#A1CFF0)"><span>${s.name}</span></button>`).join('')}</div>`;
    } else if (W.src === 'upload') {
      box.innerHTML = `<label class="upload">${I.plus.replace('<svg', '<svg width="28" height="28"')}点击上传一张照片<br><small>只在你的设备上处理</small><input type="file" accept="image/*" id="fileIn" hidden></label>`;
      $('#fileIn').onchange = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { W.photo = r.result; generate(); }; r.readAsDataURL(f); };
    } else {
      box.innerHTML = `<div class="cam" id="cam"><span class="muted">正在打开摄像头…</span></div>`;
      if (!navigator.mediaDevices) { $('#cam').innerHTML = '<span style="padding:20px;text-align:center;font-size:13px">无法打开摄像头<br><small class="muted">部署到 HTTPS 网址后可用，先试试「模板」</small></span>'; return; }
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } }).then((st) => {
        camStream = st; $('#cam').innerHTML = '<video autoplay playsinline muted></video><button class="shoot" id="shoot" aria-label="拍照"></button>';
        $('#cam video').srcObject = st;
        $('#shoot').onclick = () => { const vd = $('#cam video'), cv = document.createElement('canvas'); cv.width = vd.videoWidth; cv.height = vd.videoHeight; const g = cv.getContext('2d'); g.translate(cv.width, 0); g.scale(-1, 1); g.drawImage(vd, 0, 0); W.photo = cv.toDataURL('image/jpeg', 0.9); stopCam(); $('#cam').innerHTML = `<img src="${W.photo}" style="width:100%;height:100%;object-fit:cover">`; generate(); };
      }).catch(() => { $('#cam').innerHTML = '<span style="padding:20px;text-align:center;font-size:13px">无法打开摄像头<br><small class="muted">部署到 HTTPS 网址后可用，先试试「模板」</small></span>'; });
    }
  }
  function stopCam() { if (camStream) { camStream.getTracks().forEach((t) => t.stop()); camStream = null; } }
  function generate() {
    renderPreview(true); chibiAct(document.body, 'think', 0);
    setTimeout(() => { $$('.chibi').forEach((c) => c.classList.remove('think')); renderPreview(); toast('风格已生成，可以继续调整'); }, 1500);
  }
  function cardHTML(k, small) {
    const th = D.cardThemes.find((t) => t.id === k.theme), st = D.portraitStyles.find((s) => s.id === k.style);
    const photo = k.photo ? `<img src="${k.photo}" style="filter:${k.photo.startsWith('data:') ? st.filter : 'none'}" onerror="this.remove()">` : '';
    return `<div class="ycard t-${k.theme}">
      <div class="no">No. ${String(k.n).padStart(4, '0')}</div>
      <div class="photo"><div style="width:80%;height:80%">${chibi()}</div>${photo}</div>${k.photo && k.ai ? '<span class="ai">AI 生成</span>' : ''}
      ${small ? '' : `<div class="meta"><div class="theme">${th.id.toUpperCase()}</div><div class="tname">${th.name}</div><div class="line">${th.line}</div>
      <div class="to">致 ${esc(k.toName)}</div><div class="days">${esc(k.daysText)}</div><div class="hand">${esc(k.hand)}</div><div class="sign">— 一桐</div></div>`}</div>`;
  }
  function currentCard() {
    const c = api.getComment(W.to), t = W.tier && D.tiers.find((x) => x.id === W.tier);
    return { theme: W.theme, style: W.style, photo: W.photo, ai: true, hand: W.hand, n: W.n, toName: t ? `每一位「${t.name}」的你` : c.fan, daysText: t ? '谢谢你们一路同行' : `一起走过的第 ${fmt(c.days)} 天` };
  }
  function renderPreview(loading) {
    const el = $('#cardPreview'); if (!el) return;
    el.innerHTML = `<div style="position:relative">${cardHTML(currentCard())}${loading ? `<div class="gen"><div class="g"><div class="orbx"><img class="orbimg" src="assets/orb/orb-1.png" alt=""><img class="orbimg b" src="assets/orb/orb-3.png" alt=""><span class="bub">${esc((D.portraitStyles.find((s) => s.id === W.style) || {}).name || '风格')}</span><span class="bub">${esc((D.cardThemes.find((t) => t.id === W.theme) || {}).name || '主题')}</span><span class="bub">${esc(W.hand)}</span></div>正在把它们揉进一张小卡…</div></div>` : ''}</div>`;
    
  }
  function phonePreview() {
    const k = currentCard();
    $('#modalBody').innerHTML = `<div class="phone"><div class="bar">9:41</div><div class="noti"><b>一桐给你寄来一张小卡</b>点开看看吧 ✦</div><div class="pcard">${cardHTML(k)}</div><div style="text-align:center;font-size:11px;color:var(--muted)">保存到「我的纪念册」</div></div><div class="modal-acts"><button class="btn ghost" data-close>返回修改</button><button class="btn" id="mGive">${I.gift}就这张，送出</button></div>`;
    $('#modal').classList.add('on'); $('#mGive').onclick = () => { $('#modal').classList.remove('on'); giveCard(); };
  }
  async function giveCard() {
    const k = currentCard(); await api.saveCard(k); W.n++;
    toast(`小卡已送给 ${k.toName}`); celebrate('give'); renderCards();
  }

  // ---------- 洞察 ----------
  function renderInsight() {
    const fans = [...D.comments].sort((a, b) => b.days - a.days);
    $('#v-insight').innerHTML = `<div class="sec-head" style="margin-top:20px"><h2><em>INSIGHT</em>粉丝洞察</h2><span class="internal">${I.shield.replace('<svg', '<svg width="14" height="14"')}仅你和团队可见，不对外展示</span></div>
      <div class="three reveal">
        <div class="panel">${askBtn('各分层粉丝该怎么维护？')}<h3>陪伴分层 <small class="muted" style="font-weight:400;font-size:11px">对应纪念卡</small></h3><div class="donut-wrap">${donut(D.tiers)}<div class="legend">${D.tiers.map((t) => `<div><i style="background:${t.color}"></i>${t.name}<span class="num">${t.pct}%</span></div>`).join('')}</div></div></div>
        <div class="panel"><h3>性别</h3>${bars(D.audience.gender, 100)}<h3 style="margin-top:22px">年龄</h3>${bars(D.audience.age, 45)}</div>
        <div class="panel"><h3>地域 Top 5</h3>${bars(D.audience.region, 15)}</div>
      </div>
      <div class="sec reveal"><div class="sec-head"><h2><em>01</em>成长与留存路径</h2><span class="muted" style="font-size:12px">新粉 → 活跃粉 → 核心粉 → 稳固</span></div>
        ${stepper(D.funnel.map((f) => ({ name: f.stage, sub: wan(f.n) })), 2, 0.45, '成长路径 · 当前重点：稳住核心粉')}
        <div class="funnel">${D.funnel.map((f, i) => `<div class="fstage" style="--w:${100 - i * 12}%"><div class="fbar"><b>${f.stage}</b><span class="num">${wan(f.n)}</span></div><small>${f.desc}</small>${f.next ? `<div class="fnext">${f.next}</div>` : ''}</div>`).join('')}</div>
        <div class="moves">${D.moves.map((m) => `<div class="move"><div class="mv-h">${m.from} <span>→</span> ${m.to}</div><ul>${m.acts.map((a) => `<li>${a}</li>`).join('')}</ul></div>`).join('')}</div>
        <div class="churn panel"><div><div class="muted" style="font-size:12px">流失预警</div><div class="ch-n"><span class="num">${fmt(D.churn.core)}</span> ${D.churn.desc}</div>
          <div class="ch-r">${D.churn.reasons.map((r) => `<span class="tag">${r}</span>`).join('')}</div></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn soft" data-ask="帮我给近 30 天没回访的核心粉写一段关怀">${I.spark}让助手起草关怀</button><button class="btn" data-view="cards" data-tier="changqing">批量送「长情」卡</button></div></div></div>

      <div class="sec reveal"><div class="sec-head"><h2><em>02</em>分类运营策略</h2><span class="muted" style="font-size:12px">不同粉丝，需求完全不一样</span></div>
        <div class="segs">${D.segments.map((g) => `<div class="segc">${askBtn('「' + g.name + '」该怎么运营？')}<div class="sg-top"><i style="background:${g.color}"></i><b>${g.name}</b><span class="num">${g.pct}%</span></div>
          <dl><dt>需要什么</dt><dd>${g.need}</dd><dt>怎么做</dt><dd>${g.strategy}</dd><dt>看什么指标</dt><dd>${g.metric}</dd></dl></div>`).join('')}</div></div>

      <div class="sec reveal"><div class="sec-head"><h2><em>03</em>四种粉丝画像</h2></div>
        <div class="persona-grid">${D.personas.map((p) => `<div class="persona"><div class="pct num">${p.pct}%</div><b>${p.name}</b><p>${p.want}</p><div class="tip">${I.bulb.replace('<svg', '<svg width="13" height="13" style="vertical-align:-2px"')} ${p.tip}</div></div>`).join('')}</div></div>
      <div class="sec reveal"><div class="sec-head"><h2><em>04</em>本周建议</h2></div>
        <div class="panel"><div class="tips">${D.insightsTips.map((t) => `<div>${I.bulb}<span>${t}</span></div>`).join('')}</div></div></div>
      <div class="sec reveal"><div class="sec-head"><h2><em>05</em>粉丝列表</h2><div class="filters">${['全部'].concat(D.tiers.map((t) => t.name)).map((n, i) => `<button class="chip ${i === 0 ? 'active' : ''}" data-ftier="${n}">${n}</button>`).join('')}</div></div>
        <div class="panel white" style="overflow:auto"><table class="ftable"><thead><tr><th>粉丝</th><th>分层</th><th>陪伴</th><th>累计留言</th><th>来源</th><th></th></tr></thead><tbody id="ftbody">${fanRows(fans)}</tbody></table></div></div>`;
  }
  const fanRows = (fans) => fans.map((c) => `<tr><td>${av(c.av)}${esc(c.fan)}</td><td><span class="tag">${tierName(c.tier)}</span></td><td class="num">${c.days} 天</td><td class="num">${c.total}</td><td>${platTag(c.p)}</td><td><button class="btn ghost sm" data-comment="${c.id}">查看</button></td></tr>`).join('');

  // ---------- 生日祝福 ----------
  const BD = { sel: 'b1', tone: 'warm', card: true, when: 'midnight', ch: 'dm', open: {} };
  const TONES = [['warm', '温柔'], ['light', '俏皮'], ['short', '简短']];
  const canSelf = (b) => b.qualified || BD.open[b.id];
  function bdayStatus(b) {
    const m = S.blessed[b.id];
    if (m) return `<span class="tag ok">已${m === 'self' ? '亲自' : '统一'}祝福</span>`;
    return b.qualified ? '<span class="tag rose">可亲自祝福</span>' : '<span class="tag">统一祝福</span>';
  }
  function renderBday() {
    const b = D.birthdays.find((x) => x.id === BD.sel), A = D.bdayAuto;
    const today = D.birthdays.filter((x) => x.date === '今天').length;
    const list = `<div class="bd-list">
        <div class="bd-sum"><div><b class="num">${today}</b><span>今天亲自祝福</span></div><div><b class="num">${D.birthdays.length}</b><span>本周可亲自祝福</span></div><div><b class="num">${fmt(A.today)}</b><span>今天统一祝福</span></div></div>
        ${D.birthdays.map((x) => `<button class="bd-item ${x.id === BD.sel ? 'on' : ''}" data-bsel="${x.id}">${av(x.av)}<div><b>${esc(x.fan)}</b> ${platTag(x.p)}<small>${x.date === '今天' ? '今天生日' : x.date + ' 生日'} · ${tierName(x.tier)} · 陪伴 ${fmt(x.days)} 天</small></div>${bdayStatus(x)}</button>`).join('')}
        <div class="bd-auto"><div class="bd-auto-h">${I.gift}<b>统一祝福</b><span class="muted">${fmt(A.today)} 人 · 生日当天 0 点自动发出</span></div>
          <p>${esc(A.text)}</p>
          ${S.blessed.auto ? '<span class="tag ok">今天的统一祝福已安排</span>' : `<button class="btn ghost sm" data-bauto>${I.send}确认今天的统一祝福</button>`}</div>
        <div class="muted" style="font-size:11px;margin-top:10px">亲自祝福条件：陪伴满 365 天，或是共创粉丝。生日只用于祝福，不对外展示。</div>
      </div>`;
    let compose;
    if (!canSelf(b)) {
      compose = `<div class="bd-compose panel white"><div class="fan-head">${av(b.av, 1)}<div><b>${esc(b.fan)}</b> ${platTag(b.p)}<small>${b.date === '今天' ? '今天' : b.date} · ${b.age}生日 · 陪伴 ${fmt(b.days)} 天</small></div></div>
        <div class="bd-locked">${pet('heart', 'pet-md')}<div><b>TA 会在生日当天收到统一祝福</b><p class="muted">陪伴还没满 365 天。如果你想特别对待，也可以破例亲自写。</p></div></div>
        <div class="quote">${esc(A.text)}</div>
        <div class="send-row"><span class="muted" style="font-size:12px">${S.blessed[b.id] ? '已安排' : '生日当天 0 点发出'}</span><button class="btn ghost" data-bopen="${b.id}">${I.mic}破例亲自祝福</button></div></div>`;
    } else {
      compose = `<div class="bd-compose panel white">
        <div class="fan-head">${av(b.av, 1)}<div><b>${esc(b.fan)}</b> ${platTag(b.p)}<small>${b.date === '今天' ? '今天' : b.date} · ${b.age}生日 · ${tierName(b.tier)} · 陪伴 ${fmt(b.days)} 天</small></div></div>
        <div class="bd-memo"><span class="lbl">${I.spark}小桐记得</span>${b.memo.map((m) => `<span class="tag">${esc(m)}</span>`).join('')}</div>
        <div class="composer">
          <div class="composer-top">${I.spark.replace('<svg', '<svg width="14" height="14" style="color:#1A6FD0"')}按你的口吻起草 · 可以随意修改
            <span class="tone">${TONES.map(([k, n]) => `<button class="${BD.tone === k ? 'on' : ''}" data-btone="${k}">${n}</button>`).join('')}</span></div>
          <textarea id="bdText"></textarea>
          <div class="hint">草稿只用到 TA 公开留言里的信息，最后的话由你来说。</div>
          <div class="tools"><button class="voice" id="recBtn">${I.mic}<span>录一段生日语音</span></button><span id="recOut"></span></div>
        </div>
        <div class="bd-opts">
          <label class="sw"><input type="checkbox" id="bdCard" ${BD.card ? 'checked' : ''}><i></i>附一张生日小卡（「${(D.cardThemes.find((t) => t.id === b.tier) || D.cardThemes[0]).name}」主题）</label>
          <div class="seg">${[['midnight', '生日 0 点准时送达'], ['now', '现在发送']].map(([k, n]) => `<button class="${BD.when === k ? 'on' : ''}" data-bwhen="${k}">${n}</button>`).join('')}</div>
          <div class="seg">${[['dm', P[b.p].name + '私信'], ['mp', '小程序站内信']].map(([k, n]) => `<button class="${BD.ch === k ? 'on' : ''}" data-bch="${k}">${n}</button>`).join('')}</div>
        </div>
        <div class="send-row"><button class="btn ghost" id="bdPreview">看看 TA 收到的样子</button><button class="btn" id="bdSend">${I.gift}${S.blessed[b.id] === 'self' ? '再发一次' : '送出祝福'}</button></div>
      </div>`;
    }
    return `<div class="bd-page">${list}${compose}</div>`;
  }
  function bindBday() {
    const b = D.birthdays.find((x) => x.id === BD.sel); recBlob = null;
    if (!$('#bdText')) return;
    typeInto($('#bdText'), b.drafts[BD.tone]);
    $('#recBtn').onclick = toggleRec;
    $('#bdCard').onchange = (e) => (BD.card = e.target.checked);
    $('#bdPreview').onclick = () => bdayPhone(b);
    $('#bdSend').onclick = () => sendBday(b);
  }
  function bdayPhone(b) {
    const text = $('#bdText').value.trim(), th = D.cardThemes.find((t) => t.id === b.tier) || D.cardThemes[0];
    $('#modalBody').innerHTML = `<div class="phone bd-phone"><div class="bar">00:00</div>
      <div class="noti"><b>一桐给你送来生日祝福</b>${BD.ch === 'dm' ? P[b.p].name + '私信' : '小程序站内信'} · 刚刚</div>
      <div class="bletter"><div class="bl-top">HAPPY BIRTHDAY</div><div class="bl-to">致 ${esc(b.fan)}</div>
        <p>${esc(text || '（还没写文字）')}</p>
        ${recBlob || $('#recOut').textContent ? `<div class="vbar"><span class="play">▶</span><span class="wv">${Array.from({ length: 22 }, (_, i) => `<i style="height:${6 + ((i * 7) % 15)}px"></i>`).join('')}</span><span>0:12</span></div>` : ''}
        <div class="bl-sign">— 一桐</div></div>
      ${BD.card ? `<div class="pcard" style="width:150px">${cardHTML({ theme: th.id, style: 'watercolor', photo: null, hand: '生日快乐', n: W.n, toName: b.fan, daysText: '' })}</div>` : ''}
      </div><div class="modal-acts"><button class="btn ghost" data-close>返回修改</button><button class="btn" id="mBless">${I.gift}就这样，送出</button></div>`;
    $('#modal').classList.add('on'); $('#mBless').onclick = () => { $('#modal').classList.remove('on'); sendBday(b); };
  }
  async function sendBday(b) {
    const text = $('#bdText').value.trim();
    if (!text && !recBlob) return toast('先写几句话，或录一段语音');
    await api.bless(b.id, 'self', { text, voice: !!recBlob, card: BD.card, when: BD.when, ch: BD.ch });
    if (BD.card) { await api.saveCard({ theme: b.tier, style: 'watercolor', photo: null, hand: '生日快乐', n: W.n++, toName: b.fan, daysText: '生日快乐' }); }
    toast(BD.when === 'midnight' ? `已安排，${b.fan} 会在生日 0 点收到` : `祝福已送给 ${b.fan}`);
    celebrate('give');
    const next = D.birthdays.find((x) => !S.blessed[x.id] && canSelf(x)); if (next) BD.sel = next.id;
    renderMore();
  }

  // ---------- 幸运抽奖 ----------
  const LT = { src: 'L1', prize: 'card', n: 10, rules: Object.fromEntries(D.lottery.rules.map((r) => [r.id, r.on])), last: null, rolling: false };
  function eligible() {
    const s = D.lottery.sources.find((x) => x.id === LT.src);
    return Math.round(D.lottery.rules.reduce((n, r) => n * (LT.rules[r.id] ? 1 - r.cut : 1), s.total));
  }
  const mask = (id) => id.slice(0, 3) + '***' + id.slice(-2);
  function renderLucky() {
    const L = D.lottery, s = L.sources.find((x) => x.id === LT.src), pz = L.prizes.find((x) => x.id === LT.prize), last = LT.last;
    return `<div class="lucky">
      <div class="lk-set">
        <div class="step"><h3><i>1</i>选一个抽奖活动</h3>
          <div class="lk-src">${L.sources.map((x) => `<button class="${x.id === LT.src ? 'on' : ''}" data-lsrc="${x.id}">${platTag(x.p)}<b>${esc(x.title)}</b><small>${fmt(x.total)} 人参与 · ${x.at}</small></button>`).join('')}</div></div>
        <div class="step"><h3><i>2</i>筛选规则 <small class="muted" style="font-weight:400;font-size:11px">AI 先过滤，结果可复核</small></h3>
          ${L.rules.map((r) => `<label class="sw row"><input type="checkbox" data-lrule="${r.id}" ${LT.rules[r.id] ? 'checked' : ''}><i></i>${r.name}<span class="muted num">−${fmt(Math.round(s.total * r.cut))}</span></label>`).join('')}</div>
        <div class="step"><h3><i>3</i>奖品与人数</h3>
          <div class="style-row">${L.prizes.map((p) => `<button class="chip ${p.id === LT.prize ? 'active' : ''}" data-lprize="${p.id}">${p.name}</button>`).join('')}</div>
          <label class="field">抽取人数<input type="number" id="lkN" min="1" max="30" value="${LT.n}"></label>
          <div class="muted" style="font-size:11px;margin-top:12px">不设任何消费门槛；未成年人中奖由监护人确认领取。</div></div>
      </div>
      <div class="lk-stage">
        <div class="lk-glass">
          <div class="lk-orb"><i></i><i></i><i></i></div>
          <div class="lk-head"><span>${platTag(s.p)} ${esc(s.title)}</span><span class="muted">${pz.name} × ${LT.n}</span></div>
          <div class="lk-count"><b class="num" id="lkElig">${fmt(eligible())}</b><span>位粉丝符合条件</span></div>
          <div class="lk-roll" id="lkRoll">${last ? '恭喜以下幸运儿' : '准备好了就开始吧'}</div>${last ? pet('cheer', 'lk-pet') : ''}
          <div class="lk-winners" id="lkWin">${last ? last.winners.map((w, i) => `<div class="lk-w in" style="animation-delay:${i * 40}ms"><span class="av">${esc(w.name[0])}</span><b>${esc(w.name)}</b><small>${mask(w.id)}</small></div>`).join('') : ''}</div>
          ${last ? `<div class="lk-proof">公示编号 <b>#${last.seed}</b> · ${new Date(last.at).toLocaleString('zh-CN', { hour12: false })} · 随机种子与参与名单可公开核验</div>` : ''}
          <div class="lk-acts">${last ? `<button class="btn ghost" data-lnotify>${I.send}${last.winners[0].notified ? '已通知中奖者' : '起草中奖私信'}</button><button class="btn ghost" data-lpub>生成中奖公示</button><button class="btn" data-ldraw>再抽一轮</button>` : `<button class="btn big" data-ldraw>${I.spark}开始抽奖</button>`}</div>
        </div>
        ${S.draws.length ? `<div class="lk-hist"><div class="muted" style="font-size:12px;margin-bottom:8px">抽奖记录</div>${S.draws.slice(0, 4).map((d) => `<div><b>${esc(d.source)}</b><span>${esc(d.prize)} × ${d.n}</span><span class="muted">#${d.seed}</span><span class="tag ${d.winners[0].notified ? 'ok' : ''}">${d.winners[0].notified ? '已通知' : '待通知'}</span></div>`).join('')}</div>` : ''}
      </div></div>`;
  }
  function bindLucky() {
    const n = $('#lkN'); if (n) n.onchange = () => { LT.n = Math.max(1, Math.min(30, +n.value || 1)); renderMore(); };
  }
  async function runDraw() {
    if (LT.rolling) return; LT.rolling = true;
    const s = D.lottery.sources.find((x) => x.id === LT.src), pz = D.lottery.prizes.find((x) => x.id === LT.prize);
    LT.last = null; renderMore();
    const roll = $('#lkRoll'), pool = D.lottery.pool; roll.classList.add('rolling'); $('.lk-glass').classList.add('drawing');
    chibiAct(document.body, 'think', 0);
    let i = 0, delay = 50;
    const rec = await api.draw({ source: s.title, prize: pz.name, n: LT.n, eligible: eligible() });
    await new Promise((done) => { (function tick() { roll.textContent = pool[(i++ * 7) % pool.length]; delay *= 1.07; if (delay < 260) setTimeout(tick, delay); else done(); })(); });
    $$('.chibi').forEach((c) => c.classList.remove('think'));
    roll.classList.remove('rolling'); roll.textContent = '恭喜以下幸运儿';
    const box = $('#lkWin');
    for (const w of rec.winners) { box.insertAdjacentHTML('beforeend', `<div class="lk-w in"><span class="av">${esc(w.name[0])}</span><b>${esc(w.name)}</b><small>${mask(w.id)}</small></div>`); await new Promise((r) => setTimeout(r, 120)); }
    LT.last = rec; LT.rolling = false; celebrate('happy');
    setTimeout(() => { if (current === 'more' && moreTab === 'lucky') renderMore(); }, 500);
  }
  function luckyNotify() {
    const last = LT.last; if (!last) return;
    openDrawer('通知中奖者', `<div class="muted" style="font-size:12px">将通过原活动平台私信，分别发送给 ${last.winners.length} 位中奖者</div>
      <div class="lk-chips">${last.winners.map((w) => `<span class="tag">${esc(w.name)}</span>`).join('')}</div>
      <div class="composer"><div class="composer-top">${I.spark.replace('<svg', '<svg width="14" height="14" style="color:#1A6FD0"')}按你的口吻起草 · 会自动替换成每位粉丝的昵称</div><textarea id="lkText"></textarea>
      <div class="hint">领奖只需回复收件信息，<b>不会要求任何付款</b>；请提醒粉丝警惕冒充的中奖信息。</div></div>
      <div class="send-row"><span class="muted" style="font-size:12px">发送前由你确认</span><button class="btn" id="lkSend">${I.send}发送给 ${last.winners.length} 人</button></div>`);
    typeInto($('#lkText'), `{昵称}，恭喜你被抽中啦！「${last.prize}」会在 7 天内寄出，回复这条私信留下收件信息就好。谢谢你一直在，${last.source.includes('云秀行') ? '11 月 3 日《云秀行》' : '下次'}见～ —— 一桐`);
    $('#lkSend').onclick = async () => { await api.notifyWinners(0); closeDrawer(); toast(`已私信通知 ${last.winners.length} 位中奖者`); celebrate('give'); renderMore(); };
  }

  // ---------- 更多 ----------
  let moreTab = 'bday';
  function renderMore(opts = {}) {
    if (opts.tab) moreTab = opts.tab;
    const tabs = [['bday', '生日祝福', 'birthday'], ['lucky', '幸运抽奖', 'star'], ['review', '注册审核', 'review'], ['live', '直播', 'live'], ['cal', '内容日历', 'today']];
    let body = '';
    if (moreTab === 'bday') body = renderBday();
    if (moreTab === 'lucky') body = renderLucky();
    if (moreTab === 'review') body = `<div class="panel white"><div class="muted" style="font-size:12px;margin-bottom:6px">新注册需要答题，AI 先给出风险判断，最后由团队决定</div>${D.applicants.map((a) => `<div class="apply"><div><b style="font-weight:500">${esc(a.name)}</b><small>${esc(a.note)}</small></div><span class="score num">${a.score}<small class="muted" style="font-size:11px"> 分</small></span><span class="tag ${a.risk === '高' ? 'rose' : ''}">风险 ${a.risk}</span>
      <div style="display:flex;gap:8px">${S.approved[a.id] ? `<span class="tag">${S.approved[a.id] === 'ok' ? '已通过' : '已驳回'}</span>` : `<button class="btn sm" data-approve="${a.id}" data-ok="1">通过</button><button class="btn danger sm" data-approve="${a.id}" data-ok="0">驳回</button>`}</div></div>`).join('')}</div>`;
    if (moreTab === 'live') body = `<div class="live"><div class="live-cover"><span class="onair">PRIVATE LIVE</span><div style="width:200px;height:220px">${chibi()}</div>${pet('mic', 'live-pet')}</div>
      <div class="panel"><h3>开一场私域直播</h3><div class="muted" style="font-size:12px">只对小程序里通过审核的粉丝开放</div>
        <label class="field">主题<input value="《云秀行》首播夜 · 一起看"></label><label class="field">时间<input value="11 月 3 日 20:00"></label>
        <label class="field">形式<select><option>线上小会（30 人连麦）</option><option>线上签售</option><option>公开直播</option></select></label>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:18px"><span class="muted" style="font-size:12px">已有 <b class="num" style="color:var(--blue)">2,318</b> 人预约</span><button class="btn" data-toast="直播已创建，将提醒预约的粉丝">创建直播</button></div></div></div>`;
    if (moreTab === 'cal') {
      const days = Array.from({ length: 35 }, (_, i) => i - 5);
      body = `<div class="panel"><h3>11 月内容日历</h3><div class="muted" style="font-size:12px;margin-bottom:14px">按播出节点，AI 给出的发布建议</div>
        <div class="cal">${['一', '二', '三', '四', '五', '六', '日'].map((d) => `<div class="h">${d}</div>`).join('')}${days.map((d) => { const ev = D.calendar.filter((e) => e.d === d); return d < 1 || d > 30 ? '<div></div>' : `<div class="d ${ev.length ? 'ev' : ''} ${d === 1 ? 'today' : ''}">${d}${ev.map((e) => `<span>${e.tag} · ${esc(e.t)}</span>`).join('')}</div>`; }).join('')}</div></div>
        <div class="panel" style="margin-top:18px"><h3>一份内容，多个平台</h3><div class="muted" style="font-size:12px">输入一个想法，自动改写成各平台的版本</div>
          <label class="field"><input id="ideaIn" value="分享《云秀行》定妆那天的小故事"></label><button class="btn soft sm" style="margin-top:12px" id="multiBtn">${I.spark}生成三个版本</button><div class="multi" id="multiOut"></div></div>`;
    }
    $('#v-more').innerHTML = `<div class="sec-head" style="margin-top:20px"><h2><em>MORE</em>更多</h2></div><div class="more-tabs">${tabs.map(([k, n, ic]) => `<button class="chip mtab ${moreTab === k ? 'active' : ''}" data-mtab="${k}">${ic3(ic)}${n}</button>`).join('')}</div>${body}`;
    if (moreTab === 'bday') bindBday();
    if (moreTab === 'lucky') bindLucky();
    const mb = $('#multiBtn'); if (mb) mb.onclick = () => {
      $('#multiOut').innerHTML = `<div><b>${platTag('wb')}微博</b>定妆那天在镜子前坐了四个小时，最后看到范云的那一刻，突然就懂她了。11 月 3 日，一起见她。#云秀行#</div>
        <div><b>${platTag('dy')}抖音</b>四小时，从我变成范云 ✦ 定妆幕后第一次公开（配 15 秒变装视频）</div>
        <div><b>${platTag('xhs')}小红书</b>《云秀行》定妆日记｜范云的发髻藏着一个小秘密，第三张图你发现了吗？</div>`;
    };
  }

  // ---------- 助手 ----------
  let agentOpen = false, ctxComment = null, greeted = false;
  function openAgent(q) {
    agentOpen = true; if ($('#drawer').classList.contains('on') && innerWidth >= 1100) $('#drawer').classList.add('beside'); $('#agent').classList.add('on'); $('#fab').classList.add('hidden');
    if (!$('#agentChibi').innerHTML) $('#agentChibi').innerHTML = chibi();
    if (!greeted) { greeted = true; botSay(`早上好，一桐。我读完了今天的 1,286 条留言：\n<ol><li>3 条值得你亲自回</li><li>2 条棘手消息，我已经先帮你模糊处理</li><li>2 位粉丝今天生日</li></ol>想先看哪个？`, [['看值得回的留言', 'drawer:pending'], ['看棘手消息', 'drawer:risky']]); chibiAct($('#agent'), 'wave'); }
    setSugs();
    if (q) setTimeout(() => ask(q), greeted ? 200 : 900);
    setTimeout(() => $('#agentInput').focus(), 300);
  }
  function closeAgent() { $('#drawer').classList.remove('beside'); $('#agent').classList.remove('vmode'); agentOpen = false; $('#agent').classList.remove('on'); $('#fab').classList.remove('hidden'); }
  function setSugs() {
    const map = {
      today: ['今天粉丝在聊什么？', '最近涨粉主要来自哪里？', '今天谁过生日？'],
      reply: ctxComment && $('#drawer').classList.contains('on') ? [`帮我回复「${ctxComment.fan}」`, '这位粉丝是谁？', '语气再轻松一点'] : ['哪些留言最值得回？', '棘手消息怎么处理？', '大家最常问什么？'],
      cards: ['帮我做一张长情小卡', '这周送了几张卡？', '推荐几位该送卡的粉丝'],
      insight: ['新粉怎么变成核心粉？', '哪些核心粉快流失了？', '数据粉该怎么运营？'],
      more: ['今天谁过生日？', '帮我抽 10 位幸运粉丝', '审核里有可疑的人吗？']
    };
    $('#sugs').innerHTML = map[current].map((s) => `<button data-q="${esc(s)}">${esc(s)}</button>`).join('');
  }
  function addMsg(html, who, acts) {
    const m = document.createElement('div'); m.className = 'msg ' + who;
    m.innerHTML = html.replace(/\n/g, '<br>') + (acts && acts.length ? `<div class="acts">${acts.map(([t, a]) => `<button data-act="${esc(a)}">${esc(t)}</button>`).join('')}</div>` : '');
    $('#msgs').appendChild(m); $('#msgs').scrollTop = 1e6; return m;
  }
  function botSay(html, acts) { addMsg(html, 'bot', acts); }
  function ask(q) {
    addMsg(esc(q), 'me');
    const t = addMsg(pet('think', 'pet-think') + '<span class="dots3"><i></i><i></i><i></i></span>', 'bot thinking');
    $('#agentState').innerHTML = '<i class="thinking"></i>思考中…'; chibiAct($('#agent'), 'think', 0);
    setTimeout(() => {
      t.remove(); $$('#agent .chibi').forEach((c) => c.classList.remove('think'));
      $('#agentState').innerHTML = '<i></i>在线 · 已读取今日数据';
      const [html, acts] = answer(q); botSay(html, acts); chibiAct($('#agent'), 'happy', 1000);
    }, 900 + Math.random() * 500);
  }
  function answer(q) {
    const has = (...k) => k.some((x) => q.includes(x));
    const fan = D.comments.find((c) => q.includes(c.fan)) || (has('这位', '这条') && ctxComment);
    if (fan && has('回复', '回', '草稿')) return [`按你的口吻给「${fan.fan}」写了一版：\n\n“${esc(fan.draft)}”\n\n${fan.draft.includes('【') ? '【】里需要你补一句真实经历，我不替你编。' : '可以直接改，确认后再发。'}`, [['打开回复', 'comment:' + fan.id]]];
    if (fan || has('这位粉丝', '是谁')) { const c = fan || ctxComment || D.comments[0]; return [`「${c.fan}」是${tierName(c.tier)}粉丝，陪伴了 ${c.days} 天，累计留言 ${c.total} 条。\n最近的重要时刻：${esc(c.history[c.history.length - 1])}。`, [['查看详情', 'comment:' + c.id]]]; }
    if (has('在聊', '说什么', '说了什么', '关键词', '常问')) return [`今天大家主要在聊这 5 件事：\n<ol>${D.overview.fiveThings.map((f) => `<li>${esc(f.t)}（${f.n} 条）</li>`).join('')}</ol>整体情绪 89% 是正向的，比上周高 3 个点。`, [['看「云秀行」相关留言', 'kw:云秀行'], ['看「肉肉」相关留言', 'kw:肉肉']]];
    if (has('值得', '高优', '最该回')) return [`这 3 条我建议你亲自回：\n<ol>${D.comments.filter((c) => c.prio).slice(0, 3).map((c) => `<li>${esc(c.fan)}：${esc(c.sum)}</li>`).join('')}</ol>草稿都按你的口吻备好了。`, D.comments.filter((c) => c.prio).slice(0, 3).map((c) => ['回复 ' + c.fan, 'comment:' + c.id])];
    if (has('棘手', '恶评', '可疑', '私信')) return [`有 2 条需要注意：\n<ol><li>一条情绪化差评，没有具体威胁，建议不回应。</li><li>一条私信提到你明天的片场位置，属于越界行为，建议截图留证并转交工作室。</li></ol>审核里还有 1 位高风险申请者，我建议驳回。`, [['看棘手消息', 'drawer:risky'], ['去注册审核', 'more:review']]];
    if (has('流失', '没回访', '关怀')) return [`近 30 天有 ${fmt(D.churn.core)} 位核心粉没回访，主要原因：剧集空窗期、上一条留言没被回应、转去其他平台活跃。\n我起草了一段关怀，可以群发到小程序站内：\n\n“好久没见到你啦，最近还好吗？《云秀行》11 月 3 日见，想和你一起看。”`, [['批量送「长情」卡', 'tier:changqing'], ['看成长路径', 'view:insight']]];
    if (has('运营', '转化', '新粉', '老粉', '核心粉', '数据粉', '氪金', '事业粉')) return [`五类粉丝的重点各不相同：\n<ol>${D.segments.map((g) => `<li><b>${g.name}</b>：${g.strategy}</li>`).join('')}</ol>转化主线是 新粉 → 活跃粉 → 核心粉 → 稳固，关键动作是「第一条留言尽快被回应」和「记住重要时刻」。`, [['打开分层运营', 'view:insight']]];
    if (has('涨粉', '平台', '来自哪')) return [`近 30 天全平台新增约 ${wan(D.growth[30].labels.reduce((m, _, i) => m + ['wb', 'dy', 'xhs', 'mp'].reduce((k, id) => k + D.growth[30][id][i], 0), 0))}：\n<ol><li>微博贡献最多，增长稳定</li><li>抖音环比增长最快（+41%），来自宋一梦切换那场戏的片段</li><li>小红书新增主要是插画、手账等共创内容带来的</li></ol>建议趁抖音热度再发一条幕后。`, [['看那条高赞留言', 'comment:c3']]];
    if (has('涨粉', '数据', '大白话', '为什么上涨')) return [`用大白话说：\n今天新增 ${fmt(D.overview.todayNew)} 位粉丝，比昨天多 18%，主要来自抖音上宋一梦切换那场戏的片段（单条 2,341 赞）。\n建议：趁热度再发一条这场戏的幕后，效果会比平时好。`, [['看那条高赞留言', 'comment:c3']]];
    if (has('抽奖', '幸运')) return [`可以从这 3 个活动里抽：\n<ol>${D.lottery.sources.map((x) => `<li>${esc(x.title)}（${fmt(x.total)} 人）</li>`).join('')}</ol>我会先排除机器号、营销号和有越界记录的账号，再随机抽取，并生成可核验的公示编号。`, [['去幸运抽奖', 'more:lucky']]];
    if (has('生日')) return [`今天有 2 位粉丝过生日：\n<ol><li>晚风来信 · 长情 · 陪伴 1,286 天（可以亲自祝福）。我记得她去年搬到新城市，最近常加班。</li><li>橘子汽水 · 常伴（发送统一祝福）</li></ol>另外还有 ${fmt(D.bdayAuto.today)} 位粉丝会收到统一祝福。要不要给晚风来信录一段语音？`, [['去写生日祝福', 'more:bday']]];
    if (has('小卡', '送卡', '该送')) return [`推荐这几位：\n<ol><li>晚风来信 · 今天生日，陪伴 1,286 天 → 「长情」</li><li>小岛放映室 · 刚投稿插画 → 「共创」</li><li>春天的回声 · 第一次来 → 「初遇」</li></ol>`, [['给晚风来信做一张', 'card:c1'], ['给小岛放映室做一张', 'card:c4']]];
    if (has('分层', '维护')) return [`四类粉丝各有侧重：\n<ol><li>初遇（34%）：欢迎和被看见最重要</li><li>常伴（38%）：保持回应节奏</li><li>长情（21%）：记得重要节点，比如生日</li><li>共创（7%）：贡献了 41% 的高赞内容，每周固定点评几件</li></ol>`, [['打开洞察', 'view:insight']]];
    if (has('策划', '规划', '内容', 'vlog')) return [`可以这样安排下周：\n<ol><li>周一：首播前预热，发角色海报</li><li>周三：《云秀行》首播当晚，开私域直播一起看</li><li>周五：「片场的一天」vlog，顺便回应想看日常的留言</li></ol>`, [['看内容日历', 'more:cal'], ['创建直播', 'more:live']]];
    if (has('轻松')) return ['好的，换个轻松点的说法：\n“哈哈被你发现了！谢谢你看得这么仔细，下次直播细讲～”', ctxComment ? [['用这版', 'comment:' + ctxComment.id]] : []];
    return ['我可以帮你：看今天粉丝在聊什么、找出值得回的留言、按你的口吻起草回复、提醒生日、做纪念小卡。你想先做哪件？', [['今天粉丝在聊什么', 'q:今天粉丝在聊什么？'], ['哪些最值得回', 'q:哪些留言最值得回？']]];
  }
  function runAct(a) {
    const [k, v] = a.split(':');
    if (k === 'comment') { if (window.innerWidth < 860) closeAgent(); go('reply'); openComment(v); }
    if (k === 'drawer') openSpecial(v);
    if (k === 'kw') { go('reply', { kw: v }); }
    if (k === 'more') go('more', { tab: v });
    if (k === 'card') { if (window.innerWidth < 860) closeAgent(); go('cards', { for: v }); }
    if (k === 'view') go(v);
    if (k === 'tier') { if (window.innerWidth < 860) closeAgent(); go('cards', { tier: v }); }
    if (k === 'q') ask(v);
  }
  function openSpecial(v) {
    if (v === 'pending') openList('值得你看的留言', D.comments.filter((c) => c.prio));
    if (v === 'risky') openDrawer('棘手消息', `<div class="muted" style="font-size:12px;margin-bottom:14px">内容默认模糊，点击「显示内容」后再看</div><div style="display:grid;gap:14px">${D.risky.map(riskCard).join('')}</div>`);
  }

  // ---------- 提醒 ----------
  function renderNotif() {
    const items = [
      [I.reply, '3 条高优留言等你回应', '晚风来信、橘子汽水、小满', 'drawer:pending'],
      [I.shield, '1 条越界私信', '已模糊处理，建议转交工作室', 'drawer:risky'],
      [I.gift, '晚风来信今天生日', '陪伴 1,286 天，可以亲自祝福', 'more:bday'],
      [I.spark, '定档海报抽奖今天截止', '18,642 人参与，可以开奖了', 'more:lucky'],
      [I.today, '《云秀行》下周首播', '讨论量本周上涨 64%', 'q:帮我规划下周的内容']
    ];
    $('#notif').innerHTML = items.map(([ic, t, s, a]) => `<button data-nact="${a}"><span class="ic">${ic}</span><span>${t}<small>${s}</small></span></button>`).join('');
  }

  // ---------- 杂项 ----------
  function toast(t) { const el = $('#toast'); el.innerHTML = pet('cheer') + '<span>' + esc(t) + '</span>'; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 2600); }
  function celebrate(kind) { chibiAct(document.body, kind === 'give' ? 'wave' : 'happy', 1500); chibiAct(document.body, 'happy', 1000); }
  function refreshCounts() {
    renderNav();
    if (current === 'reply') { fillReplyList(); renderSentLog(); }
    if (current === 'today') { const k = $('#kpiReplied'); if (k) k.innerHTML = Object.keys(S.replied).length + '<small>次</small>'; $$('#v-today .qcard').forEach((q) => { const b = $('[data-comment]', q); if (b && S.replied[b.dataset.comment]) { q.classList.add('done'); b.textContent = '已回应'; } }); }
  }

  // ---------- 事件委托 ----------
  // 点击助手面板以外的区域时收起
  document.addEventListener('pointerdown', (e) => {
    if (!agentOpen) return;
    if (e.target.closest('#agent,#fab,#askBar,[data-ask],[data-agent],#modal,#drawer,#toast,#notif,#bell')) return;
    closeAgent();
  });
  document.addEventListener('click', async (e) => {
    const t = e.target.closest('button,[data-agent],a,[role=button]'); if (!t) { if (!e.target.closest('#notif,#bell')) $('#notif').classList.remove('on'); return; }
    const d = t.dataset;
    if (d.ask !== undefined) { e.stopPropagation(); openAgent(d.ask); return; }
    if (t.hasAttribute('data-agent')) { openAgent(); return; }
    if (t.hasAttribute('data-pet')) { petNext(); return; }
    if (d.view) { closeDrawer(); go(d.view, { tab: d.tab, for: d.for, tier: d.tier }); return; }
    if (d.grange) { gRange = +d.grange; $('#growth').innerHTML = growthHTML(); return; }
    if (d.gmode) { gMode = d.gmode; $('#growth').innerHTML = growthHTML(); return; }
    if (d.slide) { slide(+d.slide); clearInterval(slideT); slideT = setInterval(() => slide(1), 5200); return; }
    if (d.drawer) { openSpecial(d.drawer); return; }
    if (d.comment) { openComment(d.comment); return; }
    if (d.kw) { go('reply', { kw: d.kw }); return; }
    if (d.kwclear !== undefined) { replyKw = ''; renderReply(); return; }
    if (d.cat) { replyCat = d.cat; $$('#v-reply [data-cat]').forEach((x) => x.classList.toggle('active', x === t)); fillReplyList(); return; }
    if (d.reveal) { const r = t.closest('.risk'); r.classList.toggle('show'); t.textContent = r.classList.contains('show') ? '隐藏内容' : '显示内容'; return; }
    if (d.risk) { const r = t.closest('.risk'); const m = { evidence: '已截图存档，附带时间与链接', studio: '已转交工作室处理', ignore: '已标记为不回应' }; toast(m[d.act]); if (d.act !== 'evidence') r.classList.add('gone'); return; }
    if (d.dm) { const m = D.dms.find((x) => x.id === d.dm); openDrawer('私信', `<div class="fan-head">${av(m.av, 1)}<div><b>${esc(m.fan)}</b> ${platTag(m.p)}<small>${m.time}</small></div></div><div class="quote">${esc(m.text)}</div><div class="composer"><div class="composer-top">${I.spark.replace('<svg', '<svg width="14" height="14" style="color:#1A6FD0"')}按你的口吻起草</div><textarea id="dmText"></textarea></div><div class="send-row"><span class="muted" style="font-size:12px">发送前由你确认</span><button class="btn" id="dmSend">${I.send}确认发送</button></div>`); typeInto($('#dmText'), m.id === 'd1' ? '一周年快乐！能因为一部剧遇见彼此，真好。祝你们一直这样幸福下去。' : '被你注意到啦！范云那身衣服的颜色和纹样都有讲究，播出后找机会跟大家细说。'); $('#dmSend').onclick = () => { closeDrawer(); toast('私信已发送'); celebrate('happy'); }; return; }
    if (d.src) { W.src = d.src; $$('[data-src]').forEach((x) => x.classList.toggle('active', x === t)); renderSrc(); return; }
    if (d.tpl) { W.photo = d.tpl; $$('[data-tpl]').forEach((x) => x.classList.toggle('on', x === t)); const st = D.portraitStyles.find((s) => s.img === d.tpl); if (st) { W.style = st.id; $$('[data-style]').forEach((x) => x.classList.toggle('active', x.dataset.style === st.id)); } generate(); return; }
    if (d.style) { W.style = d.style; $$('[data-style]').forEach((x) => x.classList.toggle('active', x === t)); if (W.src === 'tpl') { W.photo = D.portraitStyles.find((s) => s.id === d.style).img; renderSrc(); } generate(); return; }
    if (d.theme) { W.theme = d.theme; $$('[data-theme]').forEach((x) => x.classList.toggle('on', x === t)); renderPreview(); return; }
    if (d.close !== undefined) { $('#modal').classList.remove('on'); return; }
    if (d.mtab) { go('more', { tab: d.mtab }); return; }
    if (d.bless) { await api.bless(d.bless, d.mode); toast(d.mode === 'self' ? '已录制并发送亲自祝福' : '已发送统一祝福'); celebrate('happy'); renderMore(); return; }
    if (d.bsel) { BD.sel = d.bsel; stopRec(); renderMore(); return; }
    if (d.btone) { BD.tone = d.btone; $$('[data-btone]').forEach((x) => x.classList.toggle('on', x === t)); typeInto($('#bdText'), D.birthdays.find((x) => x.id === BD.sel).drafts[d.btone]); return; }
    if (d.bwhen) { BD.when = d.bwhen; $$('[data-bwhen]').forEach((x) => x.classList.toggle('on', x === t)); return; }
    if (d.bch) { BD.ch = d.bch; $$('[data-bch]').forEach((x) => x.classList.toggle('on', x === t)); return; }
    if (d.bopen) { BD.open[d.bopen] = true; renderMore(); return; }
    if (d.bauto !== undefined) { await api.bless('auto', 'auto'); D.birthdays.filter((x) => x.date === '今天' && !x.qualified && !S.blessed[x.id]).forEach((x) => api.bless(x.id, 'auto')); toast(`已安排 ${fmt(D.bdayAuto.today)} 位粉丝的统一祝福`); celebrate('happy'); setTimeout(renderMore, 150); return; }
    if (d.lsrc) { LT.src = d.lsrc; LT.last = null; renderMore(); return; }
    if (d.lprize) { LT.prize = d.lprize; LT.n = D.lottery.prizes.find((x) => x.id === d.lprize).n; renderMore(); return; }
    if (d.ldraw !== undefined) { runDraw(); return; }
    if (d.lnotify !== undefined) { luckyNotify(); return; }
    if (d.lpub !== undefined) { toast('中奖公示图已生成，可直接发布到原活动下'); return; }
    if (d.approve) { await api.approve(d.approve, d.ok === '1'); toast(d.ok === '1' ? '已通过，欢迎加入' : '已驳回'); renderMore(); return; }
    if (d.ftier) { $$('[data-ftier]').forEach((x) => x.classList.toggle('active', x === t)); const tid = (D.tiers.find((x) => x.name === d.ftier) || {}).id; $('#ftbody').innerHTML = fanRows(D.comments.filter((c) => !tid || c.tier === tid).sort((a, b) => b.days - a.days)); return; }
    if (d.toast) { toast(d.toast); celebrate('happy'); return; }
    if (d.q) { ask(d.q); return; }
    if (d.act && t.closest('.msg')) { runAct(d.act); return; }
    if (d.nact) { $('#notif').classList.remove('on'); runAct(d.nact); return; }
  });
  document.addEventListener('change', (e) => { const r = e.target.dataset && e.target.dataset.lrule; if (r) { LT.rules[r] = e.target.checked; const el = $('#lkElig'); if (el) el.textContent = fmt(eligible()); } });
  $('#fab').innerHTML += chibi(1);
  $('#fab').onclick = () => openAgent();
  $('#askBar').onclick = () => openAgent();
  $('#agentClose').onclick = closeAgent;
  $('#agentForm').onsubmit = (e) => { e.preventDefault(); const v = $('#agentInput').value.trim(); if (!v) return; $('#agentInput').value = ''; ask(v); };
  // 语音模式（参考 AI Music）：轻点开始说话 → 识别成文字 → 直接提问
  $('#agent').insertAdjacentHTML('beforeend', `<div class="voice-stage" id="voiceStage"><div class="vorb"></div><div class="vt" id="vt">想问什么，直接说</div><div class="vs" id="vs">轻点开始说话</div><div class="vmodes"><button data-vmode="text">文字</button><button class="on">语音</button></div></div>`);
  const VQ = ['今天粉丝在聊什么？', '今天谁过生日？', '帮我抽 10 位幸运粉丝', '哪些核心粉快流失了？'];
  let vqi = 0;
  $('#agentMic').onclick = () => { $('#agent').classList.add('vmode'); $('#vt').textContent = '想问什么，直接说'; $('#vs').textContent = '轻点开始说话'; };
  $('#voiceStage').onclick = (e) => {
    if (e.target.closest('[data-vmode]')) { $('#agent').classList.remove('vmode'); $('#agentInput').focus(); return; }
    const st = $('#voiceStage'); if (st.classList.contains('listening')) return;
    st.classList.add('listening'); $('#vs').textContent = '正在听…';
    const q = VQ[vqi++ % VQ.length];
    setTimeout(() => { $('#vt').textContent = '“' + q + '”'; }, 900);
    setTimeout(() => { st.classList.remove('listening'); $('#agent').classList.remove('vmode'); ask(q); }, 1700);
  };
  $('#drawerClose').onclick = closeDrawer;
  $('#scrim').onclick = closeDrawer;
  $('#modal').onclick = (e) => { if (e.target.id === 'modal') $('#modal').classList.remove('on'); };
  $('#bell').onclick = (e) => { e.stopPropagation(); renderNotif(); $('#notif').classList.toggle('on'); };
  $('#collapse').onclick = () => document.body.classList.toggle('side-collapsed');
  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) { e.preventDefault(); openAgent(); }
    if (e.key === 'Escape') { if ($('#modal').classList.contains('on')) $('#modal').classList.remove('on'); else if ($('#drawer').classList.contains('on')) closeDrawer(); else if (agentOpen) closeAgent(); }
  });

  const RENDER = { today: renderToday, reply: renderReply, cards: renderCards, insight: renderInsight, more: renderMore };
  // 支持 #reply 这类直达链接
  const start = location.hash.replace('#', '');
  go(VIEWS.some((v) => v.id === start) ? start : 'today');
  // 开屏：品牌出现 → 后台从下方浮起（参考 UI动效参考.mp4）
  (function splash() {
    const sp = $('#splash'), b = document.body;
    const finish = () => { if (!sp.isConnected || sp.classList.contains('out')) return; sp.classList.add('out'); b.classList.remove('booting'); b.classList.add('booted'); setTimeout(() => { sp.remove(); b.classList.remove('booted'); }, 1300); };
    if (!sp) return b.classList.remove('booting');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || /nosplash/.test(location.search)) { sp.remove(); b.classList.remove('booting'); return; }
    sp.onclick = finish; setTimeout(finish, 2600);
  })();
  window.demo = { go, openAgent, ask, openComment, reset: api.reset };
})();
