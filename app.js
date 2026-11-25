// EMKT — interacciones + animaciones GSAP
{
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Video del hero: más lento, más lujoso ---------- */
  const video = $('.hero-video');
  if (video) {
    video.playbackRate = 0.6;
    video.addEventListener('loadedmetadata', () => { video.playbackRate = 0.6; });
    if (reduce) video.pause();
    const p = video.play(); if (p && p.catch) p.catch(() => {});
  }

  /* ---------- Idioma ES / EN ---------- */
  const en = {
    'nav.eco': 'Ecosystem', 'nav.work': 'Work', 'nav.ind': 'Industries', 'nav.studio': 'Studio', 'nav.contact': 'Contact',
    'cta': 'Book a consultation', 'cta.work': 'See our work',
    'hero.eyebrow': 'Digital marketing agency — California / San Miguel de Allende',
    'hero.l1': 'Two markets.', 'hero.l2': 'One', 'hero.l3': 'standard.',
    'hero.lead': 'We position luxury brands across the Mexico–United States corridor with data precision and cultural fluency.',
    'hero.m1': 'Bicultural digital<br>marketing agency<br>for 12 years.', 'hero.m2': 'California<br>San Miguel de Allende',
    'hero.kicker': 'Luxury and technology<br>for two markets', 'hero.m3': 'Data Hub · Creative Branding<br>Production Lab · Shop',
    'hero.m4': 'Book a<br>consultation',
    'studio.eyebrow': '01 — Studio',
    'studio.statement': 'Luxury and technology don’t blend. At their best, they are the same thing: absolute precision in service of an experience found nowhere else.',
    'studio.lead': 'For twelve years we have built brands that carry the same authority in Beverly Hills as in a boutique hotel in San Miguel de Allende. We don’t translate campaigns: we think them from both sides.',
    'eco.eyebrow': '02 — Ecosystem', 'eco.title': 'Four branches.<br>One operation.',
    'eco.lead': 'Each branch stands on its own. Together they cover a brand’s full cycle: from data to craft, from craft to sale.',
    'work.eyebrow': '03 — Selected work', 'work.title': 'Brands with judgment.', 'work.all': 'View full portfolio',
    'cor.eyebrow': '04 — The corridor', 'cor.title': 'One team, two time zones, the same standard.', 'cor.ind': 'Industries',
    'contact.eyebrow': '05 — Contact', 'contact.big': 'Let’s talk.'
  };
  const original = {};
  $$('[data-i18n]').forEach((el) => { original[el.dataset.i18n] = el.innerHTML; });
  const setLang = (lang) => {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => {
      const k = el.dataset.i18n;
      el.innerHTML = lang === 'en' && en[k] ? en[k] : original[k];
    });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    if (window.gsap) {
      gsap.fromTo('[data-i18n]', { opacity: 0.2 }, { opacity: 1, duration: 0.5, stagger: 0.01 });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
  };
  $$('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ---------- Nav sólida al salir del hero ---------- */
  const navEl = $('.nav');
  const onScroll = () => navEl.classList.toggle('solid', window.scrollY > window.innerHeight * 0.7);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  const menuBtn = $('.menu-btn');
  const links = $('.nav-links');
  menuBtn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- Copiar HEX ---------- */
  const toast = $('.toast');
  $$('.swatch').forEach((s) => s.addEventListener('click', () => {
    const hex = s.dataset.hex;
    const done = (ok) => {
      toast.textContent = ok ? hex + ' copiado' : hex;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1600);
    };
    try { navigator.clipboard.writeText(hex).then(() => done(true), () => done(false)); } catch (e) { done(false); }
  }));

  /* ---------- Utilidades para dividir texto ---------- */
  const splitWords = (el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => '<span class="w">' + w + '</span>').join(' ');
    return $$('.w', el);
  };
  const splitChars = (el) => {
    el.innerHTML = Array.from(el.textContent.trim()).map((c) => '<span class="ch">' + c + '</span>').join('');
    return $$('.ch', el);
  };

  /* ---------- GSAP ---------- */
  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out' });

    // Hero: entrada
    const intro = gsap.timeline({ defaults: { duration: 1.3, ease: 'expo.out' } });
    intro
      .fromTo('.hero-video', { scale: 1.45, '--blur': '24px' }, { scale: 1.15, '--blur': '2px', duration: 2.4, ease: 'power3.out' })
      .from('.hero-title .line > span', { yPercent: 105, stagger: 0.1 }, 0.35)
      .from('.hero-in', { y: 14, opacity: 0, stagger: 0.07, duration: 1 }, 0.8)
      .from('.nav > *', { y: -12, opacity: 0, stagger: 0.06, duration: 0.8 }, 0.6)
      .from('.scroll-cue span', { scaleY: 0, transformOrigin: 'top', duration: 0.8 }, 1.4);
    gsap.to('.scroll-cue span', { y: 10, opacity: 0.3, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.2 });

    // Hero: al bajar, el video se acerca y se desenfoca; el título sube
    gsap.to('.hero-video', { scale: 1.35, '--blur': '14px', ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-title', { yPercent: -35, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.fromTo('.hero', { '--fade': 1 }, { '--fade': 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '40% top', scrub: true } });

    // Hero: el video se desplaza levemente con el cursor
    const vx = gsap.quickTo('.hero-media', 'x', { duration: 1.4 });
    const vy = gsap.quickTo('.hero-media', 'y', { duration: 1.4 });
    $('.hero').addEventListener('pointermove', (e) => {
      vx((e.clientX / window.innerWidth - 0.5) * -30);
      vy((e.clientY / window.innerHeight - 0.5) * -30);
    });

    // Capa flotante: parallax a distintas velocidades + deriva lenta
    $$('.float-layer .f').forEach((el, i) => {
      const speed = parseFloat(el.dataset.speed || '-1');
      gsap.to(el, {
        y: () => speed * ScrollTrigger.maxScroll(window) * 0.22,
        rotation: speed * 40,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 1.2, invalidateOnRefresh: true }
      });
      gsap.to(el, { x: (i % 2 ? 1 : -1) * gsap.utils.random(12, 30), duration: gsap.utils.random(4, 8), ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });

    // Nav: se oculta al bajar y aparece al subir
    const nav = $('.nav');
    ScrollTrigger.create({
      start: 120, end: 'max',
      onUpdate: (self) => gsap.to(nav, { yPercent: self.direction === 1 ? -100 : 0, duration: 0.4, overwrite: true })
    });

    // Encabezados genéricos de sección
    $$('.section .eyebrow, .h2, .head-row .lead, .link-line, .subhead > *').forEach((el) => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1.1, scrollTrigger: { trigger: el, start: 'top 88%' } });
    });

    // Estudio: el manifiesto se "lee" palabra por palabra
    const words = splitWords($('#estudio .statement'));
    gsap.fromTo(words, { opacity: 0.12 }, { opacity: 1, stagger: 0.05, ease: 'none',
      scrollTrigger: { trigger: '#estudio .statement', start: 'top 80%', end: 'bottom 45%', scrub: true } });
    gsap.from('#estudio .lead', { y: 30, opacity: 0, duration: 1, scrollTrigger: { trigger: '#estudio .lead', start: 'top 90%' } });

    // Tensiones: entran desde lados opuestos y el "+" gira
    $$('.tensions li').forEach((li, i) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: li, start: 'top 90%' } });
      tl.from(li.children[0], { x: -50, opacity: 0, duration: 0.9 })
        .from(li.children[2], { x: 50, opacity: 0, duration: 0.9 }, 0)
        .from(li.children[1], { rotation: -180, scale: 0, duration: 0.9, ease: 'back.out(2)' }, 0.1);
    });

    // Ecosistema: ramas en cascada, las cápsulas crecen
    gsap.from('.branch', { y: 70, opacity: 0, stagger: 0.12, duration: 1.1, scrollTrigger: { trigger: '.branches', start: 'top 82%' } });
    gsap.from('.branch .chip', { scaleY: 0, stagger: 0.12, duration: 1.4, delay: 0.3, ease: 'elastic.out(1, 0.5)', scrollTrigger: { trigger: '.branches', start: 'top 82%' } });
    $$('.branch').forEach((b) => {
      const chip = $('.chip', b);
      b.addEventListener('pointerenter', () => gsap.to(chip, { scaleY: 1.4, duration: 0.6, ease: 'elastic.out(1, 0.5)' }));
      b.addEventListener('pointerleave', () => gsap.to(chip, { scaleY: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' }));
    });

    // Trabajo: imágenes se descubren con máscara y la cápsula hace parallax
    $$('.case').forEach((c, i) => {
      const fig = $('figure', c);
      gsap.fromTo(fig, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, delay: i * 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.work', start: 'top 80%' } });
      gsap.fromTo($('.capsule', fig), { y: 80 }, { y: -80, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from($('h3', c), { y: 20, opacity: 0, duration: 0.9, delay: 0.3 + i * 0.12, scrollTrigger: { trigger: '.work', start: 'top 80%' } });
    });

    // Corredor: el punto viaja de California a San Miguel
    const route = $('.route');
    gsap.to('.route .runner', { x: () => route.clientWidth - 8, ease: 'none',
      scrollTrigger: { trigger: '.corridor', start: 'top 75%', end: 'bottom 35%', scrub: 1, invalidateOnRefresh: true } });
    gsap.from('.corridor > div:not(.route)', { y: 30, opacity: 0, stagger: 0.15, duration: 1, scrollTrigger: { trigger: '.corridor', start: 'top 85%' } });
    gsap.from('#corredor .statement', { y: 40, opacity: 0, duration: 1.1, scrollTrigger: { trigger: '#corredor .statement', start: 'top 88%' } });
    gsap.from('.pill', { scale: 0.6, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'back.out(2)', scrollTrigger: { trigger: '.pills', start: 'top 90%' } });

    // Contacto: letras que suben una por una
    const chars = splitChars($('.big-word'));
    gsap.from(chars, { yPercent: 100, opacity: 0, rotation: 8, stagger: 0.035, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.big-word', start: 'top 85%' } });
    gsap.from('.contact-row > *, .contact dl > div', { y: 30, opacity: 0, stagger: 0.1, duration: 0.9, scrollTrigger: { trigger: '.contact-row', start: 'top 90%' } });
    gsap.to('.contact .halo', { x: -120, y: -80, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: true } });

    // Anexo de marca
    gsap.from('.logo-card', { y: 60, opacity: 0, stagger: 0.15, duration: 1.1, scrollTrigger: { trigger: '.logos', start: 'top 85%' } });
    gsap.from('.swatch', { y: 50, opacity: 0, stagger: 0.1, duration: 1, scrollTrigger: { trigger: '.swatches', start: 'top 88%' } });
    gsap.fromTo('.specimen', { '--w': 62 }, { '--w': 125, ease: 'none', scrollTrigger: { trigger: '.type-grid', start: 'top 85%', end: 'bottom 30%', scrub: true } });
    gsap.from('.materials figure', { y: 80, opacity: 0, stagger: 0.15, duration: 1.2, scrollTrigger: { trigger: '.materials', start: 'top 85%' } });
    $$('.materials .capsule').forEach((c, i) => gsap.to(c, { y: -14, rotation: i % 2 ? 4 : -4, duration: 3 + i, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    gsap.from('.principles > div', { y: 40, opacity: 0, stagger: 0.12, duration: 1, scrollTrigger: { trigger: '.principles', start: 'top 88%' } });
    gsap.from('.not span', { opacity: 0, x: -10, stagger: 0.06, duration: 0.6, scrollTrigger: { trigger: '.not', start: 'top 92%' } });

    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

}
