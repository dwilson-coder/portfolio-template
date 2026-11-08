/* ============================================================
   CONFIG
   ============================================================ */

/*
  ┌─────────────────────────────────────────────────────────────┐
  │  EDIT YOUR CONTACT EMAIL BELOW                              │
  │                                                             │
  │  This is the address that receives form submissions.        │
  │  Change the value to your own email.                        │
  │                                                             │
  │  Example: const CONTACT_EMAIL = 'you@yourdomain.com';       │
  └─────────────────────────────────────────────────────────────┘
*/
const CONTACT_EMAIL = 'hello@yourdomain.com'; // ← EDIT THIS

/*
  ┌─────────────────────────────────────────────────────────────┐
  │  EDIT YOUR WEBSITE NAME & URL BELOW                         │
  │                                                             │
  │  These appear in the email header so you know where         │
  │  the submission came from.                                  │
  └─────────────────────────────────────────────────────────────┘
*/
const SITE_NAME = 'Your Name — Portfolio'; // ← EDIT THIS
const SITE_URL  = 'https://yourdomain.com';  // ← EDIT THIS

/*
  ┌─────────────────────────────────────────────────────────────┐
  │  WORK DATA SOURCE                                           │
  │                                                             │
  │  Projects are loaded from data/work.json.                   │
  │  To add/edit/remove projects, open that file and modify     │
  │  the JSON array. No JS changes needed.                      │
  └─────────────────────────────────────────────────────────────┘
*/
const WORK_DATA_URL = 'data/work.json';

/* ============================================================
   SIDE NAV TOGGLE (mobile)
   ============================================================ */
const navToggle  = document.getElementById('navToggle');
const sideNav    = document.getElementById('sideNav');
const navOverlay = document.getElementById('navOverlay');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    sideNav.classList.toggle('open');
    navOverlay.classList.toggle('active');
  });

  navOverlay.addEventListener('click', () => {
    sideNav.classList.remove('open');
    navOverlay.classList.remove('active');
  });

  sideNav.querySelectorAll('.side-nav__links a').forEach((link) => {
    link.addEventListener('click', () => {
      sideNav.classList.remove('open');
      navOverlay.classList.remove('active');
    });
  });
}

/* ============================================================
   WORK GALLERY – LOAD FROM JSON & RENDER CARDS
   ============================================================ */
async function loadWorkData() {
  try {
    const res = await fetch(WORK_DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to load work data:', err);
    return [];
  }
}

function renderWorkGrid(projects) {
  const grid = document.getElementById('workGrid');
  if (!grid) return;

  grid.innerHTML = projects.map((p) => `
    <figure class="work__card" data-lightbox data-slug="${p.id}">
      <img src="${p.image}" alt="${p.title}" loading="lazy" />
      <div class="work__card-overlay">
        <span class="work__card-type">${p.type}</span>
        <h3 class="work__card-title">${p.title}</h3>
        <p class="work__card-desc">${p.description}</p>
      </div>
    </figure>
  `).join('');
}

/* ============================================================
   WORK DETAIL PAGE – POPULATE FROM JSON BY ?id=
   ============================================================ */
function renderDetailPage(projects) {
  const content = document.getElementById('detailContent');
  if (!content) return;

  const params  = new URLSearchParams(window.location.search);
  const slug    = params.get('id');
  const project = projects.find((p) => p.id === slug);

  if (!project) {
    content.innerHTML = '<p class="detail__loading">Project not found. <a href="index.html#work">Go back</a>.</p>';
    return;
  }

  document.title = `${project.title} — Your Name`;

  content.innerHTML = `
    <div class="detail__hero">
      <img src="${project.image}" alt="${project.title}" />
    </div>
    <div class="detail__body">
      <span class="detail__type">${project.type}</span>
      <h1 class="detail__title">${project.title}</h1>
      <p class="detail__desc">${project.fullDescription}</p>

      <div class="detail__meta">
        <div class="detail__meta-item">
          <span class="detail__meta-label">Year</span>
          <span>${project.year}</span>
        </div>
        <div class="detail__meta-item">
          <span class="detail__meta-label">Client</span>
          <span>${project.client}</span>
        </div>
        <div class="detail__meta-item">
          <span class="detail__meta-label">Type</span>
          <span>${project.type}</span>
        </div>
      </div>

      <div class="detail__tags">
        ${project.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>

      ${project.link ? `<a href="${project.link}" target="_blank" class="btn detail__link"><i class="fas fa-external-link-alt"></i> View Live Project</a>` : ''}
    </div>
  `;
}

/* ============================================================
   EMAIL BODY BUILDER
   Constructs a rich, structured email with context headers
   ============================================================ */
function buildEmailBody({ name, email, subject, message }) {
  // --- Timestamp with timezone ---
  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };
  const timestamp = now.toLocaleString('en-US', options);

  // --- Browser / environment info ---
  const userAgent = navigator.userAgent;
  const screen    = `${window.screen.width}×${window.screen.height}`;
  const viewport  = `${window.innerWidth}×${window.innerHeight}`;
  const referrer  = document.referrer || 'Direct / No referrer';

  // --- Build structured body ---
  const body =
    `╔══════════════════════════════════════════════════════════╗\n` +
    `║          NEW CONTACT FORM SUBMISSION                     ║\n` +
    `╚══════════════════════════════════════════════════════════╝\n\n` +

    `┌─ SUBMISSION INFO ────────────────────────────────────────┐\n` +
    `│  From:      ${name} <${email}>\n` +
    `│  Date:      ${timestamp}\n` +
    `│  Source:    ${SITE_NAME}\n` +
    `│  URL:       ${SITE_URL}\n` +
    `│  Subject:   ${subject}\n` +
    `└─────────────────────────────────────────────────────────┘\n\n` +

    `┌─ MESSAGE ────────────────────────────────────────────────┐\n` +
    message.split('\n').map(line => `│  ${line}`).join('\n') + `\n` +
    `└─────────────────────────────────────────────────────────┘\n\n` +

    `┌─ SUBMISSION DETAILS ─────────────────────────────────────┐\n` +
    `│  Browser:   ${userAgent}\n` +
    `│  Screen:    ${screen}\n` +
    `│  Viewport:  ${viewport}\n` +
    `│  Referrer:  ${referrer}\n` +
    `└─────────────────────────────────────────────────────────┘\n\n` +
    `─────────────────────────────────────────────────────────\n` +
    `This email was generated automatically by the contact form\n` +
    `on ${SITE_NAME} (${SITE_URL}).\n`;

  return body;
}

/* ============================================================
   CONTACT FORM – VALIDATION + ENCRYPTED MAILTO
   ============================================================ */
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('formSubmitBtn');
const statusEl  = document.getElementById('formStatus');

if (form) {
  const validators = {
    formName: (v) => {
      if (!v.trim()) return 'Name is required.';
      if (v.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    formEmail: (v) => {
      if (!v.trim()) return 'Email is required.';
      const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
      if (!re.test(v.trim())) return 'Please enter a valid email address.';
      return '';
    },
    formSubject: (v) => {
      if (!v.trim()) return 'Subject is required.';
      if (v.trim().length < 3) return 'Subject must be at least 3 characters.';
      return '';
    },
    formMessage: (v) => {
      if (!v.trim()) return 'Message is required.';
      if (v.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';
    },
  };

  function validateField(input) {
    const errorEl = form.querySelector(`[data-error-for="${input.id}"]`);
    const msg = validators[input.id](input.value);
    input.classList.toggle('invalid', !!msg);
    input.classList.toggle('valid', !msg && input.value.trim() !== '');
    if (errorEl) errorEl.textContent = msg;
    return !msg;
  }

  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = form.querySelectorAll('input, textarea');
    let allValid = true;
    fields.forEach((f) => {
      if (!validateField(f)) allValid = false;
    });

    if (!allValid) {
      statusEl.textContent = 'Please fix the errors above.';
      statusEl.className = 'form-status error';
      return;
    }

    const name    = form.formName.value.trim();
    const email   = form.formEmail.value.trim();
    const subject = form.formSubject.value.trim();
    const message = form.formMessage.value.trim();

    // Build the rich email body
    const body = buildEmailBody({ name, email, subject, message });

    const mailtoHref =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(`[${SITE_NAME}] Contact Form: ${subject} — from ${name}`)}` +
      `&body=${encodeURIComponent(body)}`;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      window.location.href = mailtoHref;
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      statusEl.textContent = 'Your email client should open. Press "Send" to deliver.';
      statusEl.className = 'form-status success';

      form.reset();
      form.querySelectorAll('input, textarea').forEach((f) => {
        f.classList.remove('valid', 'invalid');
      });
      form.querySelectorAll('.form-error').forEach((el) => el.textContent = '');
    }, 600);
  });
}

/* ============================================================
   LIGHTBOX – ENHANCED (fullscreen, swipe, keyboard, counter)
   ============================================================ */
const lightbox        = document.getElementById('lightbox');
const lightboxImg     = lightbox ? lightbox.querySelector('.lightbox__img') : null;
const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox__caption') : null;
const lightboxCounter = lightbox ? lightbox.querySelector('.lightbox__counter') : null;
const closeBtn        = lightbox ? lightbox.querySelector('.lightbox__close') : null;
const prevBtn         = lightbox ? lightbox.querySelector('.lightbox__prev') : null;
const nextBtn         = lightbox ? lightbox.querySelector('.lightbox__next') : null;
const fullscreenBtn   = lightbox ? lightbox.querySelector('.lightbox__fullscreen') : null;

let cards = [];
let currentIndex = 0;
let images = [];

function initLightbox() {
  cards = document.querySelectorAll('[data-lightbox]');
  images = Array.from(cards).map((card) => ({
    src: card.querySelector('img').src,
    caption: card.querySelector('.work__card-title')?.textContent || '',
    slug: card.dataset.slug || '',
  }));

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      const slug = card.dataset.slug;
      if (slug) {
        window.location.href = `work-detail.html?id=${slug}`;
      }
    });
  });

  if (!closeBtn) return;

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  fullscreenBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleFullscreen(); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    switch (e.key) {
      case 'Escape':     closeLightbox();      break;
      case 'ArrowLeft':  showPrev();           break;
      case 'ArrowRight': showNext();           break;
      case 'f': case 'F': toggleFullscreen();  break;
    }
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? showNext() : showPrev();
    }
  }, { passive: true });

  document.addEventListener('fullscreenchange', () => {
    fullscreenBtn.innerHTML = document.fullscreenElement
      ? '<i class="fas fa-compress"></i>'
      : '<i class="fas fa-expand"></i>';
  });
}

function updateLightbox() {
  lightboxImg.src = images[currentIndex].src;
  lightboxImg.alt = images[currentIndex].caption;
  lightboxCaption.textContent = images[currentIndex].caption;
  lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
}

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (document.fullscreenElement) document.exitFullscreen();
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateLightbox();
}

function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  updateLightbox();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    lightbox.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

/* ============================================================
   INIT – ROUTE BASED ON PAGE
   ============================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  const isDetailPage = !!document.getElementById('detailContent');

  if (isDetailPage) {
    const projects = await loadWorkData();
    renderDetailPage(projects);
  } else {
    const projects = await loadWorkData();
    renderWorkGrid(projects);
    initLightbox();
  }
});   