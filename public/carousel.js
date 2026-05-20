/* =============================================================
   CAROUSEL + LIGHTBOX — shared across VKF and CDR sites
   Loaded before photo-registry.js. Exposes:
     window.buildCarousel(img, urls)   — replaces <img> with carousel
     window.openLightbox(urls, index)  — opens full-screen lightbox
   ============================================================= */
(function () {

  /* ---- Inject styles ---- */
  const css = `
    /* Carousel */
    .photo-carousel {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .carousel-slides {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .carousel-slide {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.45s ease;
      cursor: zoom-in;
      display: block;
    }
    .carousel-slide.active { opacity: 1; }
    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(31,29,24,0.42);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      color: #F4EEE2;
      border: 1px solid rgba(244,238,226,0.18);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 1.15rem;
      line-height: 1;
      cursor: pointer;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      padding: 0;
    }
    .carousel-btn:hover { background: rgba(31,29,24,0.75); }
    .carousel-prev { left: 10px; }
    .carousel-next { right: 10px; }
    .carousel-dots {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
      z-index: 3;
    }
    .carousel-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(244,238,226,0.45);
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
      border: none;
      padding: 0;
    }
    .carousel-dot.active {
      background: #F4EEE2;
      transform: scale(1.4);
    }
    /* Single images also get a lightbox cursor */
    img[data-photo-slot] { cursor: zoom-in; }

    /* Lightbox */
    .lightbox {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.94);
      z-index: 9000;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .lightbox.open { display: flex; }
    .lightbox-img {
      max-width: 92vw;
      max-height: 88vh;
      object-fit: contain;
      border-radius: 3px;
      display: block;
      box-shadow: 0 12px 60px rgba(0,0,0,0.7);
      transition: opacity 0.2s ease;
    }
    .lightbox-close {
      position: absolute;
      top: 18px;
      right: 22px;
      background: none;
      border: none;
      color: rgba(244,238,226,0.7);
      font-size: 2.2rem;
      line-height: 1;
      cursor: pointer;
      padding: 6px;
      transition: color 0.2s;
    }
    .lightbox-close:hover { color: #F4EEE2; }
    .lightbox-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(244,238,226,0.08);
      border: 1px solid rgba(244,238,226,0.18);
      color: #F4EEE2;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      padding: 0;
    }
    .lightbox-nav:hover { background: rgba(244,238,226,0.18); }
    .lightbox-prev { left: 20px; }
    .lightbox-next { right: 20px; }
    .lightbox-counter {
      position: absolute;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(244,238,226,0.5);
      font-size: 0.78rem;
      letter-spacing: 0.14em;
      font-family: -apple-system, 'Manrope', sans-serif;
      white-space: nowrap;
    }
    @media (max-width: 600px) {
      .lightbox-nav { display: none; }
      .lightbox-img { max-width: 98vw; max-height: 80vh; }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);


  /* ===== LIGHTBOX ===== */
  let lb = null, lbImg, lbPrev, lbNext, lbClose, lbCounter;
  let lbUrls = [], lbIdx = 0;

  function ensureLightbox() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&#x2715;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#x2039;</button>
      <img class="lightbox-img" src="" alt="Full-size photo">
      <button class="lightbox-nav lightbox-next" aria-label="Next">&#x203a;</button>
      <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(lb);
    lbImg     = lb.querySelector('.lightbox-img');
    lbPrev    = lb.querySelector('.lightbox-prev');
    lbNext    = lb.querySelector('.lightbox-next');
    lbClose   = lb.querySelector('.lightbox-close');
    lbCounter = lb.querySelector('.lightbox-counter');

    lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    lbPrev.addEventListener('click', () => showAt(lbIdx - 1));
    lbNext.addEventListener('click', () => showAt(lbIdx + 1));

    /* Touch swipe */
    let touchStartX = 0;
    lb.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) showAt(lbIdx + (dx < 0 ? 1 : -1));
    });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   showAt(lbIdx - 1);
      if (e.key === 'ArrowRight')  showAt(lbIdx + 1);
    });
  }

  function showAt(idx) {
    lbIdx = ((idx % lbUrls.length) + lbUrls.length) % lbUrls.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = lbUrls[lbIdx];
      lbImg.style.opacity = '1';
    }, 80);
    const multi = lbUrls.length > 1;
    lbPrev.style.display  = multi ? '' : 'none';
    lbNext.style.display  = multi ? '' : 'none';
    lbCounter.textContent = multi ? `${lbIdx + 1} / ${lbUrls.length}` : '';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    setTimeout(() => { lbImg.src = ''; }, 200);
  }

  window.openLightbox = function (urls, idx) {
    ensureLightbox();
    lbUrls = Array.isArray(urls) ? urls : [urls];
    showAt(idx || 0);
    lb.classList.add('open');
  };


  /* ===== CAROUSEL BUILDER ===== */
  window.buildCarousel = function (img, urls) {
    /* Create wrapper that fills the parent exactly as the img did */
    const wrap = document.createElement('div');
    wrap.className = 'photo-carousel';

    const slidesWrap = document.createElement('div');
    slidesWrap.className = 'carousel-slides';

    const slideEls = urls.map((url, i) => {
      const s = document.createElement('img');
      s.src   = url;
      s.alt   = img.alt || '';
      s.className = 'carousel-slide' + (i === 0 ? ' active' : '');
      s.addEventListener('click', () => window.openLightbox(urls, i));
      slidesWrap.appendChild(s);
      return s;
    });

    wrap.appendChild(slidesWrap);

    let current = 0;
    let dotEls  = [];

    function goTo(idx) {
      slideEls[current].classList.remove('active');
      if (dotEls[current]) dotEls[current].classList.remove('active');
      current = ((idx % urls.length) + urls.length) % urls.length;
      slideEls[current].classList.add('active');
      if (dotEls[current]) dotEls[current].classList.add('active');
    }

    if (urls.length > 1) {
      const prev = document.createElement('button');
      prev.className = 'carousel-btn carousel-prev';
      prev.setAttribute('aria-label', 'Previous photo');
      prev.innerHTML = '&#x2039;';
      prev.addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });

      const next = document.createElement('button');
      next.className = 'carousel-btn carousel-next';
      next.setAttribute('aria-label', 'Next photo');
      next.innerHTML = '&#x203a;';
      next.addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });

      const dotsWrap = document.createElement('div');
      dotsWrap.className = 'carousel-dots';
      dotEls = urls.map((_, i) => {
        const d = document.createElement('button');
        d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', `Photo ${i + 1}`);
        d.addEventListener('click', e => { e.stopPropagation(); goTo(i); });
        dotsWrap.appendChild(d);
        return d;
      });

      /* Touch swipe on carousel */
      let tx = 0;
      slidesWrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
      slidesWrap.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - tx;
        if (Math.abs(dx) > 30) goTo(current + (dx < 0 ? 1 : -1));
      });

      wrap.appendChild(prev);
      wrap.appendChild(next);
      wrap.appendChild(dotsWrap);
    }

    /* Auto-advance — interval in ms, overridable via data-carousel-interval on the original img */
    if (urls.length > 1) {
      const interval = parseInt(img.dataset.carouselInterval, 10) || 5000;
      let timer = setInterval(() => goTo(current + 1), interval);
      wrap.addEventListener('mouseenter', () => clearInterval(timer));
      wrap.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(current + 1), interval); });
      wrap.addEventListener('touchstart', () => clearInterval(timer), { passive: true });
    }

    /* Swap img → carousel in DOM */
    img.parentNode.insertBefore(wrap, img);
    img.remove();
  };

})();
