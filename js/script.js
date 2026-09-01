/* ============================================================
   PORTFOLIO HUB — script
   Loads data/projects.json and renders both the live project
   grid (with category filtering) and the blueprint-style
   "in progress" cards. Also handles the disappearing header.

   NOTE: fetch() of a local JSON file requires being served over
   http(s) — this works automatically on GitHub Pages, but if you
   test locally by double-clicking index.html, the browser will
   block it (CORS on file://). Run a quick local server instead,
   e.g. `python3 -m http.server` from this folder, then visit
   http://localhost:8000
   ============================================================ */

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Disappearing/reappearing header ---------- */
(function headerScroll() {
  const header = document.getElementById('siteHeader');
  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const scrollingDown = y > lastY && y > 120;
    header.classList.toggle('hide', scrollingDown);
    lastY = y;
  }, { passive: true });
})();

/* Resume button now links directly to a pre-filled mailto request —
   no placeholder guard needed anymore. */

/* ---------- Load + render projects ---------- */
let allProjects = [];

fetch('data/projects.json')
  .then((res) => {
    if (!res.ok) throw new Error('Failed to load projects.json');
    return res.json();
  })
  .then((data) => {
    allProjects = data.live || [];
    renderProjects('All');
    renderBlueprints(data.pending || []);
  })
  .catch((err) => {
    console.error(err);
    document.getElementById('projectGrid').innerHTML =
      '<p class="mono" style="font-size:0.85rem;color:var(--ink-dim);">Could not load project data — if you\'re viewing this file locally, run a local server (see script.js comment) rather than opening index.html directly.</p>';
  });

// Real licensed photos (Unsplash/Pexels) for categories that have one.
// Categories not in this map (currently Tools/Research) fall back to the
// line-art SVG icon below.
const CATEGORY_PHOTOS = {
  Solar: 'https://images.unsplash.com/photo-1674606071893-2a9023075f70?w=800&auto=format&fit=crop&q=75',
  Wind: 'https://images.unsplash.com/photo-1508791290064-c27cc1ef7a9a?w=800&auto=format&fit=crop&q=75',
  Hydro: 'https://images.unsplash.com/photo-1580960062319-b904d81f8b59?w=800&auto=format&fit=crop&q=75',
  Tools: 'https://images.unsplash.com/photo-1725161779206-1dbd23169e42?w=800&auto=format&fit=crop&q=75',
  Storage: 'images/storage-bess.webp',
};

function categoryIcon(category) {
  // Small on-brand line-art illustrations, one per category — animated to
  // match the site's existing SVG language (see wind-turbine-calculator).
  if (category === 'Solar') {
    return `<svg viewBox="0 0 200 100" class="thumb-icon" aria-hidden="true">
      <circle cx="164" cy="26" r="11" fill="none" stroke="#f5a623" stroke-width="1.5" opacity="0.8">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
      ${[0,45,90,135,180,225,270,315].map(a => `<line x1="164" y1="26" x2="${164+16*Math.cos(a*Math.PI/180)}" y2="${26+16*Math.sin(a*Math.PI/180)}" stroke="#f5a623" stroke-width="1.5" opacity="0.5"/>`).join('')}
      <g stroke="#35c2c1" stroke-width="1.2" fill="rgba(53,194,193,0.06)">
        <rect x="18" y="46" width="34" height="20" />
        <rect x="54" y="46" width="34" height="20" />
        <rect x="18" y="68" width="34" height="20" />
        <rect x="54" y="68" width="34" height="20" />
        <line x1="18" y1="56" x2="52" y2="56" /><line x1="54" y1="56" x2="88" y2="56" />
        <line x1="18" y1="78" x2="52" y2="78" /><line x1="54" y1="78" x2="88" y2="78" />
      </g>
    </svg>`;
  }
  if (category === 'Wind') {
    return `<svg viewBox="0 0 200 100" class="thumb-icon" aria-hidden="true">
      <line x1="70" y1="90" x2="70" y2="30" stroke="#aab5c2" stroke-width="2" />
      <line x1="70" y1="30" x2="70" y2="4" stroke="#35c2c1" stroke-width="2.5" stroke-linecap="round" />
      <line x1="70" y1="30" x2="92" y2="42" stroke="#35c2c1" stroke-width="2.5" stroke-linecap="round" />
      <line x1="70" y1="30" x2="48" y2="42" stroke="#35c2c1" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="70" cy="30" r="3" fill="#f5a623" class="pulse-dot" />
      <line x1="120" y1="90" x2="120" y2="45" stroke="#6d7885" stroke-width="1.5" opacity="0.5" />
      <circle cx="120" cy="45" r="1.8" fill="#6d7885" opacity="0.5" />
    </svg>`;
  }
  if (category === 'Hydro') {
    return `<svg viewBox="0 0 200 100" class="thumb-icon" aria-hidden="true">
      <rect x="30" y="20" width="14" height="60" fill="none" stroke="#35c2c1" stroke-width="1.5" opacity="0.7" />
      <path d="M44 35 L120 35 L120 55 L44 55 Z" fill="rgba(53,194,193,0.08)" stroke="#35c2c1" stroke-width="1.5" />
      <path d="M120 62 Q135 55 150 62 T180 62" fill="none" stroke="#f5a623" stroke-width="1.5" opacity="0.7">
        <animate attributeName="d" values="M120 62 Q135 55 150 62 T180 62;M120 62 Q135 68 150 62 T180 62;M120 62 Q135 55 150 62 T180 62" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M120 74 Q135 67 150 74 T180 74" fill="none" stroke="#f5a623" stroke-width="1.5" opacity="0.4">
        <animate attributeName="d" values="M120 74 Q135 67 150 74 T180 74;M120 74 Q135 80 150 74 T180 74;M120 74 Q135 67 150 74 T180 74" dur="3s" begin="0.4s" repeatCount="indefinite" />
      </path>
    </svg>`;
  }
  // Tools / Research / Hydro fallback — schematic grid/circuit motif
  return `<svg viewBox="0 0 200 100" class="thumb-icon" aria-hidden="true">
    <g stroke="#aab5c2" stroke-width="1.2" opacity="0.6" fill="none">
      <path d="M20 70 L60 70 L60 40 L110 40 L110 60 L160 60" />
      <path d="M20 30 L45 30 L45 55" />
    </g>
    <circle cx="60" cy="70" r="3" fill="#f5a623"><animate attributeName="r" values="3;4.5;3" dur="2.4s" repeatCount="indefinite" /></circle>
    <circle cx="110" cy="40" r="3" fill="#35c2c1"><animate attributeName="r" values="3;4.5;3" dur="2.4s" begin="0.6s" repeatCount="indefinite" /></circle>
    <circle cx="160" cy="60" r="3" fill="#f5a623"><animate attributeName="r" values="3;4.5;3" dur="2.4s" begin="1.2s" repeatCount="indefinite" /></circle>
  </svg>`;
}

function renderProjects(filter) {
  const grid = document.getElementById('projectGrid');
  const items = filter === 'All' ? allProjects : allProjects.filter((p) => p.category === filter);

  grid.innerHTML = items.map((p) => {
    const demoLink = p.demo_url && p.demo_url !== 'TODO'
      ? `<a href="${p.demo_url}" target="_blank" rel="noopener">Live Demo →</a>`
      : `<a class="disabled" href="#" aria-disabled="true">Live Demo</a>`;
    const githubLink = p.github_url && p.github_url !== 'TODO'
      ? `<a href="${p.github_url}" target="_blank" rel="noopener">GitHub</a>`
      : `<a class="disabled" href="#" aria-disabled="true">GitHub</a>`;

    const thumbContent = CATEGORY_PHOTOS[p.category]
      ? `<img class="thumb-photo" src="${CATEGORY_PHOTOS[p.category]}" alt="${p.category} project thumbnail" loading="lazy" />`
      : categoryIcon(p.category);

    return `
      <article class="project-card" data-category="${p.category}">
        <div class="project-thumb">
          ${thumbContent}
          <span class="tag-badge">${p.category}</span>
        </div>
        <div class="project-body">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div class="project-tags">${p.tags.map((t) => `<span>${t}</span>`).join('')}</div>
          <div class="project-links">${demoLink}${githubLink}</div>
        </div>
      </article>
    `;
  }).join('');
}

/* ---------- Filter buttons ---------- */
document.getElementById('filterRow').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  renderProjects(btn.dataset.filter);
});

/* ---------- Blueprint / pending cards ---------- */
function renderBlueprints(pending) {
  const grid = document.getElementById('blueprintGrid');
  grid.innerHTML = pending.map((p, i) => {
    // Purely cosmetic progress value so the drafting-table cards
    // don't all look identical — not a real completion metric.
    const pct = [0.15, 0.35, 0.25, 0.1, 0.4][i % 5];
    const thumbContent = CATEGORY_PHOTOS[p.category]
      ? `<img class="blueprint-photo" src="${CATEGORY_PHOTOS[p.category]}" alt="" loading="lazy" />`
      : '';

    return `
      <div class="blueprint-card">
        ${thumbContent}
        <span class="blueprint-tag">${p.category} · IN DEV</span>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="blueprint-progress" style="--pct:${pct}"><span></span></div>
        <div class="blueprint-meta">
          <span>STATUS: DRAFTING</span>
          <span>ETA ${p.eta}</span>
        </div>
      </div>
    `;
  }).join('');
}

/* ---------- Resume request dialog ---------- */
(function resumeDialog() {
  const dialog = document.getElementById('resumeDialog');
  const openBtn = document.getElementById('resumeBtn');
  const closeBtn = document.getElementById('dialogClose');
  const closeSuccessBtn = document.getElementById('dialogCloseSuccess');
  const form = document.getElementById('resumeForm');
  const successPanel = document.getElementById('resumeSuccess');
  if (!dialog || !openBtn || !form) return;

  openBtn.addEventListener('click', () => dialog.showModal());
  closeBtn.addEventListener('click', () => dialog.close());
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', () => dialog.close());

  // Click on the backdrop (outside the form) also closes it
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        form.hidden = true;
        successPanel.hidden = false;
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Request';
        alert('Something went wrong — please try again, or email mugomba.tendekai@gmail.com directly.');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Request';
      alert('Something went wrong — please try again, or email mugomba.tendekai@gmail.com directly.');
    }
  });
})();

/* ---------- About section photo slideshow ---------- */
(function aboutSlideshow() {
  const container = document.getElementById('aboutSlideshow');
  if (!container) return;
  const slides = container.querySelectorAll('.slide');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  if (slides.length < 2) return;

  let current = 0;
  const intervalMs = 4000; // advance to next photo every 4 seconds
  let timer = null;

  // Moves to a specific slide index, wrapping around in either direction
  function goTo(index) {
    slides[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, intervalMs);
  }

  // Manual navigation restarts the auto-advance countdown, so clicking an
  // arrow doesn't get immediately overridden by the timer a moment later
  function manualNav(action) {
    action();
    startTimer();
  }

  if (nextBtn) nextBtn.addEventListener('click', () => manualNav(next));
  if (prevBtn) prevBtn.addEventListener('click', () => manualNav(prev));

  startTimer();

  // Pause when the tab isn't visible, resume when it is — no point
  // burning cycles animating something nobody's looking at.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(timer);
    } else {
      startTimer();
    }
  });
})();
