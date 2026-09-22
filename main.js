/* =========================================================
   Phil Philshed Learning Center — main.js
   Vanilla JS, no dependencies. Organized into small,
   independent functions so each feature is easy to edit.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initSmoothNavClose();
  initScrollReveal();
  initStatCounters();
  initGallery();
  initLightbox();
  initTestimonialSlider();
  initContactForm();
  initBackToTop();
});

/* ---------- Header: subtle change on scroll ---------- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobile hamburger menu ---------- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  const scrim = document.getElementById('nav-scrim');
  if (!hamburger || !nav || !scrim) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    scrim.classList.remove('visible');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
  };
  const openMenu = () => {
    nav.classList.add('open');
    scrim.classList.add('visible');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });
  scrim.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close the menu when a nav link is clicked (mobile UX requirement)
  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

/* ---------- Highlight active nav link + close-on-click smooth scroll ---------- */
function initSmoothNavClose() {
  const links = document.querySelectorAll('.nav-link');
  const sections = Array.from(links)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!('IntersectionObserver' in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Scroll reveal for section headers / cards ---------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
    observer.observe(el);
  });
}

/* ---------- Animated stat counters ---------- */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCount);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => observer.observe(el));
}

/* ---------- Gallery: data-driven so it's easy to edit ---------- */
/* Edit this array to add/remove/replace gallery photos.
   Set "src" to a real image path (e.g. "images/gallery/campus-1.jpg")
   once you have real photography — until then, a labeled color
   placeholder is shown automatically. */
const GALLERY_ITEMS = [
  { category: 'campus', title: 'Main campus entrance', color: '#2F5233', src: '' },
  { category: 'classroom', title: 'Primary classroom', color: '#A8532E', src: '' },
  { category: 'students', title: 'Students in the library', color: '#C99A3B', src: '' },
  { category: 'activities', title: 'Inter-house sports day', color: '#7C9473', src: '' },
  { category: 'campus', title: 'School courtyard', color: '#1F3823', src: '' },
  { category: 'events', title: 'Graduation ceremony', color: '#8A6A2F', src: '' },
  { category: 'classroom', title: 'ICT computer lab', color: '#3E6B44', src: '' },
  { category: 'students', title: 'Science club project', color: '#B5563C', src: '' },
  { category: 'activities', title: 'Music and drama club', color: '#5C7A55', src: '' },
  { category: 'events', title: 'Parents\u2019 open day', color: '#C2872F', src: '' },
  { category: 'campus', title: 'Play and recreation area', color: '#274A2B', src: '' },
  { category: 'classroom', title: 'Early childhood room', color: '#9C6A3E', src: '' },
];

function initGallery() {
  const grid = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!grid) return;

  const render = () => {
    grid.innerHTML = GALLERY_ITEMS.map((item, i) => `
      <button class="gallery-item" data-category="${item.category}" data-index="${i}" aria-label="View ${item.title}">
        ${item.src
          ? `<img src="${item.src}" alt="${item.title}" loading="lazy">`
          : `<span class="gallery-fallback" style="background:${item.color}">${item.title}</span>`}
        <span class="gallery-caption">${item.title}</span>
      </button>
    `).join('');
  };
  render();

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.gallery-item').forEach((el) => {
        const match = filter === 'all' || el.getAttribute('data-category') === filter;
        el.classList.toggle('hide', !match);
      });
    });
  });
}

/* ---------- Lightbox ---------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const content = document.getElementById('lightbox-content');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const grid = document.getElementById('gallery-grid');
  if (!lightbox || !content || !grid) return;

  let currentIndex = 0;
  let lastFocused = null;

  const visibleIndexes = () =>
    Array.from(document.querySelectorAll('.gallery-item:not(.hide)')).map((el) =>
      parseInt(el.getAttribute('data-index'), 10)
    );

  const renderSlide = (index) => {
    const item = GALLERY_ITEMS[index];
    content.innerHTML = `
      <div class="lb-visual" style="background:${item.color}">${item.title}</div>
      <p>${item.title}</p>
    `;
  };

  const open = (index) => {
    currentIndex = index;
    renderSlide(currentIndex);
    lightbox.hidden = false;
    lastFocused = document.activeElement;
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  const step = (dir) => {
    const list = visibleIndexes();
    if (!list.length) return;
    const pos = list.indexOf(currentIndex);
    const nextPos = (pos + dir + list.length) % list.length;
    currentIndex = list[nextPos];
    renderSlide(currentIndex);
  };

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.gallery-item');
    if (!btn) return;
    open(parseInt(btn.getAttribute('data-index'), 10));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

/* ---------- Testimonial slider ---------- */
function initTestimonialSlider() {
  const track = document.getElementById('testimonial-track');
  const dotsWrap = document.getElementById('testimonial-dots');
  if (!track || !dotsWrap) return;

  const slides = Array.from(track.children);
  let index = 0;
  let timer = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }

  function startAuto() {
    if (reduceMotion) return;
    stopAuto();
    timer = setInterval(() => goTo(index + 1), 6000);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  track.parentElement.addEventListener('mouseenter', stopAuto);
  track.parentElement.addEventListener('mouseleave', startAuto);
  track.parentElement.addEventListener('focusin', stopAuto);
  track.parentElement.addEventListener('focusout', startAuto);

  goTo(0);
  startAuto();
}

/* ---------- Contact form validation ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form || !feedback) return;

  const fields = {
    fullName: { el: document.getElementById('full-name'), err: document.getElementById('err-full-name') },
    email: { el: document.getElementById('email'), err: document.getElementById('err-email') },
    phone: { el: document.getElementById('phone'), err: document.getElementById('err-phone') },
    subject: { el: document.getElementById('subject'), err: document.getElementById('err-subject') },
    message: { el: document.getElementById('message'), err: document.getElementById('err-message') },
  };

  const validators = {
    fullName: (v) => v.trim().length >= 2 || 'Please enter your full name.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
    phone: (v) => /^[0-9+()\-.\s]{7,20}$/.test(v.trim()) || 'Please enter a valid phone number.',
    subject: (v) => v.trim().length >= 3 || 'Please enter a short subject.',
    message: (v) => v.trim().length >= 10 || 'Please enter a message of at least 10 characters.',
  };

  const validateField = (key) => {
    const { el, err } = fields[key];
    const result = validators[key](el.value);
    if (result === true) {
      el.classList.remove('invalid');
      err.textContent = '';
      return true;
    }
    el.classList.add('invalid');
    err.textContent = result;
    return false;
  };

  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('invalid')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(fields).map(validateField);
    const allValid = results.every(Boolean);

    feedback.classList.remove('success', 'error');

    if (!allValid) {
      feedback.classList.add('error');
      feedback.textContent = 'Please fix the highlighted fields and try again.';
      return;
    }

    /* No backend is connected yet. This form needs a backend/API
       (e.g. a serverless function, Formspree, or a custom endpoint)
       to actually deliver messages. For now we simulate success so
       the interface and validation are ready to wire up. */
    feedback.classList.add('success');
    feedback.textContent = "Thank you! Your enquiry has been received \u2014 we'll be in touch soon.";
    form.reset();
  });
}

/* ---------- Back to top button ---------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  const toggle = () => btn.classList.toggle('visible', window.scrollY > 500);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
}
