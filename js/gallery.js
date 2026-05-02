// Gallery filter + lightbox.
// Loaded on /gallery/ and /gallery/<case-study>/.

(function () {
  'use strict';

  // ============================================================
  // FILTER (only present on the gallery hub)
  // ============================================================
  var filterButtons = document.querySelectorAll('[data-filter]');
  var emptyState   = document.getElementById('lsg-filter-empty');

  // Per-filter empty-state copy. Add more entries here as new filters appear.
  var emptyMessages = {
    business: 'Commercial projects coming soon — we’ll feature Lanier’s work for businesses here as photos become available.',
  };

  function applyFilter(filter) {
    var visible = 0;
    var figures = document.querySelectorAll('figure[data-cat]');
    figures.forEach(function (fig) {
      var cats = (fig.getAttribute('data-cat') || '').split(/\s+/);
      var matches = (filter === 'all') || cats.indexOf(filter) !== -1;
      fig.style.display = matches ? '' : 'none';
      if (matches) visible++;
    });
    filterButtons.forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-filter') === filter);
    });
    if (emptyState) {
      var msg = emptyMessages[filter];
      if (visible === 0 && msg) {
        emptyState.textContent = msg;
        emptyState.classList.add('is-shown');
      } else {
        emptyState.classList.remove('is-shown');
      }
    }
    rebuildLightboxList();
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyFilter(btn.getAttribute('data-filter'));
    });
  });

  // ============================================================
  // LIGHTBOX
  // ============================================================
  var visibleTriggers = [];
  var currentIdx = 0;

  function rebuildLightboxList() {
    visibleTriggers = Array.prototype.slice.call(document.querySelectorAll('img.lsg-zoomable'))
      .filter(function (img) {
        // Skip images inside a hidden figure (filtered out).
        var fig = img.closest('[data-cat]');
        if (!fig) return true;
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
    '<div id="lsg-lightbox-stage">' +
      '<img id="lsg-lightbox-img" alt="" />' +
      '<button class="lsg-lightbox-btn lsg-lightbox-prev" aria-label="Previous photo">‹</button>' +
      '<button class="lsg-lightbox-btn lsg-lightbox-next" aria-label="Next photo">›</button>' +
    '</div>' +
    '<div id="lsg-lightbox-caption">' +
      '<span id="lsg-lightbox-text"></span>' +
      '<span id="lsg-lightbox-counter"></span>' +
    '</div>';
  document.body.appendChild(overlay);

  var lbImg     = overlay.querySelector('#lsg-lightbox-img');
  var lbText    = overlay.querySelector('#lsg-lightbox-text');
  var lbCounter = overlay.querySelector('#lsg-lightbox-counter');
  var lbClose   = overlay.querySelector('.lsg-lightbox-close');
  var lbPrev    = overlay.querySelector('.lsg-lightbox-prev');
  var lbNext    = overlay.querySelector('.lsg-lightbox-next');
  var lbStage   = overlay.querySelector('#lsg-lightbox-stage');

  function show(idx) {
    if (visibleTriggers.length === 0) return;
    currentIdx = ((idx % visibleTriggers.length) + visibleTriggers.length) % visibleTriggers.length;
    var img = visibleTriggers[currentIdx];
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    lbText.textContent = img.alt || '';
    lbCounter.textContent = (currentIdx + 1) + ' / ' + visibleTriggers.length;
    var multi = visibleTriggers.length > 1;
    lbPrev.style.display = multi ? '' : 'none';
    lbNext.style.display = multi ? '' : 'none';
  }

  function open(triggerImg) {
    rebuildLightboxList();
    var idx = visibleTriggers.indexOf(triggerImg);
    if (idx < 0) return;
    show(idx);
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lsg-no-scroll');
    lbClose.focus();
  }

  function close() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lsg-no-scroll');
    lbImg.src = '';
  }

  function next() { show(currentIdx + 1); }
  function prev() { show(currentIdx - 1); }

  // Wire up triggers (called once at load + after dynamic changes if needed).
  function wireTriggers() {
    document.querySelectorAll('img.lsg-zoomable').forEach(function (img) {
      if (img.dataset.lbWired) return;
      img.dataset.lbWired = '1';
      img.addEventListener('click', function () { open(img); });
    });
  }
  wireTriggers();

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', function (e) { e.stopPropagation(); prev(); });
  lbNext.addEventListener('click', function (e) { e.stopPropagation(); next(); });
  // Click outside the image (anywhere on overlay backdrop) closes.
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target === lbStage) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowRight') { next(); }
    else if (e.key === 'ArrowLeft')  { prev(); }
  });

  // Touch swipe on mobile.
  var touchStartX = 0, touchStartY = 0;
  overlay.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  overlay.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    // Only horizontal swipes count.
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) prev(); else next();
    }
  }, { passive: true });

  // Initial visible-trigger list.
  rebuildLightboxList();
})();
