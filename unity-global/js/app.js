'use strict';

/**
 * Unity Global — curated diagnosis of major world issues.
 * Figures are order-of-magnitude reference points, not live stats;
 * each issue links to its primary source to verify the current number.
 */
const ISSUES = [
  {
    id: 'clima',
    category: 'Clima',
    title: 'Cambio climático y desastres naturales',
    summary: 'El calentamiento global intensifica sequías, incendios e inundaciones, y ya desplaza a millones de personas cada año.',
    stat: 'Referencia: el IPCC documenta que los eventos climáticos extremos han aumentado en frecuencia e intensidad desde la era preindustrial.',
    sources: [
      { label: 'IPCC — informes científicos', url: 'https://www.ipcc.ch/' },
      { label: 'UNFCCC — acuerdos climáticos', url: 'https://unfccc.int/' },
    ],
  },
  {
    id: 'conflictos',
    category: 'Conflictos y paz',
    title: 'Guerras y desplazamiento forzado',
    summary: 'Los conflictos activos en varias regiones han elevado el número de personas desplazadas a cifras históricas.',
    stat: 'Referencia: ACNUR reporta decenas de millones de personas desplazadas por la fuerza en el mundo; consulta la cifra vigente en su sitio.',
    sources: [
      { label: 'ACNUR — datos de desplazamiento', url: 'https://www.acnur.org/' },
      { label: 'CICR — derecho internacional humanitario', url: 'https://www.icrc.org/es' },
    ],
  },
  {
    id: 'desigualdad',
    category: 'Desigualdad',
    title: 'Desigualdad económica y costo de vida',
    summary: 'La inflación acumulada y la concentración de riqueza han hecho que vivienda y alimentos básicos sean inalcanzables para una parte creciente de la población.',
    stat: 'Referencia: Oxfam y el Banco Mundial publican anualmente indicadores de concentración de riqueza y pobreza extrema.',
    sources: [
      { label: 'Oxfam — informes de desigualdad', url: 'https://www.oxfam.org/es' },
      { label: 'Banco Mundial — pobreza', url: 'https://www.bancomundial.org/es/topic/poverty' },
    ],
  },
  {
    id: 'migracion',
    category: 'Migración',
    title: 'Migración y crisis fronterizas',
    summary: 'Conflicto, clima y falta de oportunidades empujan movimientos migratorios que superan la capacidad de respuesta de muchos países.',
    stat: 'Referencia: la OIM mantiene el registro más completo de rutas y cifras migratorias globales.',
    sources: [
      { label: 'OIM — Organización Internacional para las Migraciones', url: 'https://www.iom.int/es' },
    ],
  },
  {
    id: 'salud-mental',
    category: 'Salud mental',
    title: 'Crisis de salud mental y soledad',
    summary: 'Ansiedad, depresión y soledad crecen con fuerza particular entre jóvenes, agravadas por el uso intensivo de redes sociales.',
    stat: 'Referencia: la OMS clasifica la salud mental como una de las principales cargas de enfermedad no transmisible a nivel mundial.',
    sources: [
      { label: 'OMS — salud mental', url: 'https://www.who.int/es/health-topics/mental-health' },
      { label: 'Mental Health America', url: 'https://mhanational.org/' },
    ],
  },
  {
    id: 'desinformacion',
    category: 'Desinformación e IA',
    title: 'Desinformación y confianza institucional',
    summary: 'Contenido sintético e IA generativa aceleran la desinformación, erosionando la confianza en medios e instituciones.',
    stat: 'Referencia: UNESCO trabaja guías internacionales de alfabetización mediática frente a la desinformación impulsada por IA.',
    sources: [
      { label: 'UNESCO — alfabetización mediática', url: 'https://www.unesco.org/es/media-information-literacy' },
    ],
  },
  {
    id: 'educacion',
    category: 'Educación',
    title: 'Brecha educativa y digital',
    summary: 'Millones de niños siguen sin acceso a educación básica de calidad ni a conectividad, ampliando la brecha con quienes sí la tienen.',
    stat: 'Referencia: UNESCO publica el estado global de acceso y calidad educativa por región.',
    sources: [
      { label: 'UNESCO — educación', url: 'https://www.unesco.org/es/education' },
      { label: 'Khan Academy — educación gratuita', url: 'https://es.khanacademy.org/' },
    ],
  },
  {
    id: 'alimentacion',
    category: 'Seguridad alimentaria',
    title: 'Inseguridad alimentaria y de agua',
    summary: 'Conflictos, clima y logística global dejan a comunidades enteras sin acceso estable a alimentos y agua potable.',
    stat: 'Referencia: el PMA y la FAO monitorean el número de personas en inseguridad alimentaria aguda cada año.',
    sources: [
      { label: 'PMA — Programa Mundial de Alimentos', url: 'https://es.wfp.org/' },
      { label: 'FAO', url: 'https://www.fao.org/home/es' },
    ],
  },
];

const ACTIONS = ISSUES.map((issue) => ({
  id: issue.id,
  label: issue.title,
}));

const STORAGE_KEY = 'unity-global:commitments';

function readCommitments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeCommitments(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* localStorage unavailable (private mode, etc.) — degrade silently */
  }
}

function renderFilters() {
  const filtersEl = document.getElementById('filters');
  const categories = ['Todos', ...new Set(ISSUES.map((i) => i.category))];

  filtersEl.innerHTML = categories
    .map(
      (cat, i) => `
      <button class="ug-filter-btn" role="tab" data-filter="${cat}" aria-pressed="${i === 0}">
        ${cat}
      </button>`
    )
    .join('');

  filtersEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.ug-filter-btn');
    if (!btn) return;
    filtersEl.querySelectorAll('.ug-filter-btn').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
    renderGrid(btn.dataset.filter);
  });
}

function renderGrid(filter = 'Todos') {
  const grid = document.getElementById('issues-grid');
  const list = filter === 'Todos' ? ISSUES : ISSUES.filter((i) => i.category === filter);

  grid.innerHTML = list
    .map(
      (issue) => `
      <article class="ug-card">
        <span class="ug-card-tag">${issue.category}</span>
        <h3>${issue.title}</h3>
        <p>${issue.summary}</p>
        <p class="ug-card-stat">${issue.stat}</p>
        <div class="ug-card-links">
          ${issue.sources
            .map((s) => `<a class="ug-card-link" href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label} ↗</a>`)
            .join('')}
        </div>
      </article>`
    )
    .join('');
}

function renderCommitSelect() {
  const select = document.getElementById('commit-select');
  select.innerHTML = ACTIONS.map((a) => `<option value="${a.id}">${a.label}</option>`).join('');
}

function renderCommitLog() {
  const log = document.getElementById('commit-log');
  const items = readCommitments();

  if (!items.length) {
    log.innerHTML = '<p class="ug-commit-empty">Aún no registras compromisos en este dispositivo. Elige un frente arriba y súmate.</p>';
  } else {
    log.innerHTML = items
      .slice()
      .reverse()
      .map((item) => {
        const issue = ISSUES.find((i) => i.id === item.issueId);
        const date = new Date(item.at).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
        return `<div class="ug-commit-item">Te comprometiste con <strong>${issue ? issue.title : item.issueId}</strong> · ${date}</div>`;
      })
      .join('');
  }

  const note = document.getElementById('pledge-note');
  note.textContent = items.length
    ? `Llevas ${items.length} compromiso${items.length === 1 ? '' : 's'} registrado${items.length === 1 ? '' : 's'} desde este dispositivo.`
    : 'Aún nadie se ha unido desde este dispositivo.';
}

function handleCommit() {
  const select = document.getElementById('commit-select');
  const issueId = select.value;
  const issue = ISSUES.find((i) => i.id === issueId);
  if (!issue) return;

  const items = readCommitments();
  items.push({ issueId, at: Date.now() });
  writeCommitments(items);
  renderCommitLog();

  const firstSource = issue.sources[0];
  if (firstSource) {
    window.open(firstSource.url, '_blank', 'noopener,noreferrer');
  }
}

function setupNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderFilters();
  renderGrid();
  renderCommitSelect();
  renderCommitLog();
  setupNav();

  document.getElementById('commit-btn').addEventListener('click', handleCommit);
});
