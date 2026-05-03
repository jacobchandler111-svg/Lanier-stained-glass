// Gallery filter (multi-toggle) + lightbox.
// Loaded on /gallery/ and /gallery/<case-study>/.

(function () {
  'use strict';

  // ============================================================
  // FILTER (multi-toggle, only present on the gallery hub)
  //
  //   Initial state: every filter button is "on" (all photos visible).
  //   First click on any button: narrow to JUST that category.
  //   Subsequent clicks: toggle each category on/off.
  //   If all categories get toggled off, an empty state appears
  //   (the user can then click any button to add it back).
  // ============================================================
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var emptyState    = document.getElementById('lsg-filter-empty');
  var allCategories = filterButtons.map(function (b) { return b.getAttribute('data-filter'); });

  // Per-filter empty-state copy. Add more entries here as new filters appear.
  var emptyMessages = {
    business: 'Commercial projects coming soon — we’ll feature Lanier’s work for businesses here as photos become available.',
    _zero:    'No categories selected. Click a category above to view projects.',
    _none:    'No projects match the current selection.',
  };

  // State
  var activeSet  = new Set(allCategories);  // start with everything selected
  var firstClick = false;                    // becomes true on first user click

  function applyFilter() {
    var figures = document.querySelectorAll('figure[data-cat]');
    var visible = 0;
    figures.forEach(function (fig) {
      var cats = (fig.getAttribute('data-cat') || '').split(/\s+/);
      var matches = cats.some(function (c) { return activeSet.has(c); });
      fig.style.display = matches ? '' : 'none';
      if (matches) visible++;
    });
    filterButtons.forEach(function (b) {
      var on = activeSet.has(b.getAttribute('data-filter'));
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    if (emptyState) {
      var showEmpty = (visible === 0);
      var msg;
      if (showEmpty) {
        if (activeSet.size === 0)                                                msg = emptyMessages._zero;
        else if (activeSet.size === 1 && activeSet.has('business'))              msg = emptyMessages.business;
        else                                                                     msg = emptyMessages._none;
      }
      emptyState.classList.toggle('is-shown', showEmpty);
      if (showEmpty) emptyState.textContent = msg;
    }
    rebuildLightboxList();
  }

  function onFilterClick(filter) {
    if (!firstClick) {
      // Very first click: narrow to just this one.
      activeSet = new Set([filter]);
      firstClick = true;
    } else {
      // Subsequent clicks: toggle.
      if (activeSet.has(filter)) activeSet.delete(filter);
      else                       activeSet.add(filter);
    }
    applyFilter();
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      onFilterClick(btn.getAttribute('data-filter'));
    });
  });

  // Deep-link support: /gallery/?cat=church (or home, business) lands with
  // that single filter pre-selected. Useful when other pages link visitors
  // straight to a category (e.g. the homepage "Browse by type" tiles).
  if (filterButtons.length > 0) {
    var cat = new URLSearchParams(window.location.search).get('cat');
    var validCats = allCategories;
    if (cat && validCats.indexOf(cat) !== -1) {
      activeSet = new Set([cat]);
      firstClick = true;
      applyFilter();
    }
  }

  // ============================================================
  // LIGHTBOX
  //
  //   - Click any img.lsg-zoomable to open
  //   - Mobile: full-bleed dark overlay
  //   - Desktop (>=768px): centered parchment-card modal with arrows in the backdrop
  //   - Esc / click-outside / ✕ to close
  //   - ←/→ keys, on-screen arrows, swipe gestures to navigate
  //   - Filter-aware: only navigates among currently visible photos
  // ============================================================
  var visibleTriggers = [];
  var currentIdx = 0;

  function rebuildLightboxList() {
    visibleTriggers = Array.prototype.slice.call(document.querySelectorAll('img.lsg-zoomable'))
      .filter(function (img) {
        var fig = img.closest('[data-cat]');
        if (!fig) return true;  // not inside a filterable figure (e.g. case-study page)
        return fig.style.display !== 'none';
      });
  }

  // Build the overlay once.
  var overlay = document.createElement('div');
  overlay.id = 'lsg-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<button class="lsg-lightbox-close" aria-label="Close">✕</button>' +
    '<button class="lsg-lightbox-btn lsg-lightbox-prev" aria-label="Previous photo">‹</button>' +
    '<div id="lsg-lightbox-card">' +
      '<img id="lsg-lightbox-img" alt="" />' +
      '<div id="lsg-lightbox-caption">' +
        '<span id="lsg-lightbox-text"></span>' +
        '<span id="lsg-lightbox-counter"></span>' +
        '<span id="lsg-lightbox-hint">← → to navigate · Esc to close</span>' +
      '</div>' +
    '</div>' +
    '<button class="lsg-lightbox-btn lsg-lightbox-next" aria-label="Next photo">›</button>';
  document.body.appendChild(overlay);

  var lbImg     = overlay.querySelector('#lsg-lightbox-img');
  var lbText    = overlay.querySelector('#lsg-lightbox-text');
  var lbCounter = overlay.querySelector('#lsg-lightbox-counter');
  var lbClose   = overlay.querySelector('.lsg-lightbox-close');
  var lbPrev    = overlay.querySelector('.lsg-lightbox-prev');
  var lbNext    = overlay.querySelector('.lsg-lightbox-next');
  var lbCard    = overlay.querySelector('#lsg-lightbox-card');

  function pad(n, total) {
    var w = String(total).length;
    var s = String(n);
    while (s.length < w) s = '0' + s;
    return s;
  }

  // Preload an image at a given index (no-op if out of range)
  function preload(idx) {
    if (visibleTriggers.length === 0) return;
    var i = ((idx % visibleTriggers.length) + visibleTriggers.length) % visibleTriggers.length;
    var src = visibleTriggers[i].src;
    if (!src) return;
    var p = new Image();
    p.src = src;
  }

  function show(idx) {
    if (visibleTriggers.length === 0) return;
    currentIdx = ((idx % visibleTriggers.length) + visibleTriggers.length) % visibleTriggers.length;
    var img = visibleTriggers[currentIdx];
    // Crossfade: dim, swap, restore on load
    lbImg.classList.add('is-loading');
    var newImg = new Image();
    newImg.onload = function () {
      lbImg.src = newImg.src;
      lbImg.alt = img.alt || '';
      lbImg.classList.remove('is-loading');
    };
    newImg.onerror = function () { lbImg.classList.remove('is-loading'); };
    newImg.src = img.src;
    lbText.textContent = img.alt || '';
    lbCounter.textContent = pad(currentIdx + 1, visibleTriggers.length) + ' / ' + pad(visibleTriggers.length, visibleTriggers.length);
    var multi = visibleTriggers.length > 1;
    lbPrev.style.display = multi ? '' : 'none';
    lbNext.style.display = multi ? '' : 'none';
    // Preload neighbors so prev/next feels instant
    preload(currentIdx + 1);
    preload(currentIdx - 1);
  }

  // Scroll-lock state: store the scroll position on open so we can restore it on close.
  // Using position:fixed on body (per CSS) prevents the page from visibly jumping.
  var lockedScrollY = 0;

  function lockBodyScroll() {
    lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.top = '-' + lockedScrollY + 'px';
    document.body.classList.add('lsg-no-scroll');
  }

  function unlockBodyScroll() {
    document.body.classList.remove('lsg-no-scroll');
    document.body.style.top = '';
    // Restore exact scroll position the user was at.
    window.scrollTo(0, lockedScrollY);
  }

  function open(triggerImg) {
    rebuildLightboxList();
    var idx = visibleTriggers.indexOf(triggerImg);
    if (idx < 0) return;
    show(idx);
    lockBodyScroll();
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    // Focus the overlay itself (a fixed element) so keyboard nav works without
    // the browser trying to scroll a focused button into view.
    overlay.tabIndex = -1;
    overlay.focus({ preventScroll: true });
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    unlockBodyScroll();
    lbImg.src = '';
  }

  function next() { show(currentIdx + 1); }
  function prev() { show(currentIdx - 1); }

  // Wire up triggers.
  document.querySelectorAll('img.lsg-zoomable').forEach(function (img) {
    if (img.dataset.lbWired) return;
    img.dataset.lbWired = '1';
    img.addEventListener('click', function () { open(img); });
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
  lbNext.addEventListener('click', function (e) { e.stopPropagation(); next(); });
  // Click outside the card closes (anywhere on the dim backdrop).
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape')         { close(); }
    else if (e.key === 'ArrowRight') { next(); }
    else if (e.key === 'ArrowLeft')  { prev(); }
  });

  // Touch swipe.
  var touchStartX = 0, touchStartY = 0;
  overlay.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  overlay.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) prev(); else next();
    }
  }, { passive: true });

  rebuildLightboxList();
})();
