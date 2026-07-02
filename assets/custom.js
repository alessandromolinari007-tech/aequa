document.addEventListener('DOMContentLoaded', function() {
  var langSelect = document.querySelector('.LanguageSelector__Select');
  if (langSelect) {
    langSelect.addEventListener('change', function() {
      window.location.href = this.value;
    });
  }

  var reveals = document.querySelectorAll('.js-reveal');
  if (reveals.length) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function(el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------
   * AEQUO COOKIE BANNER — Text replacement & DOM tweaks
   * ------------------------------------------------------------------ */
  function styleCookieBanner() {
    var banner = document.querySelector('.shopify-pc__banner, #shopify-pc__banner, [data-testid="cookie-banner"]');

    if (!banner) return false;
    if (banner.dataset.aequoStyled === '1') return true;
    banner.dataset.aequoStyled = '1';

    // Find and replace the paragraph text
    var paras = banner.querySelectorAll('p');
    for (var j = 0; j < paras.length; j++) {
      var p = paras[j];
      if (p.textContent.toLowerCase().indexOf('cookie') !== -1 ||
          p.textContent.toLowerCase().indexOf('partner') !== -1 ||
          p.textContent.toLowerCase().indexOf('tecnologie') !== -1) {
        p.innerHTML = 'Utilizziamo i cookie per offrirti un\'esperienza di shopping impeccabile, personalizzare i contenuti e perfezionare le nostre collezioni. Cliccando su "Accetta", acconsenti al loro utilizzo.';
        p.style.display = 'block';
        break;
      }
    }

    // Find button container and reorder DOM
    var btnsContainer = banner.querySelector('.shopify-pc__banner__btns');
    if (!btnsContainer) {
      var anyBtn = banner.querySelector('button');
      if (anyBtn) btnsContainer = anyBtn.parentNode;
    }

    if (btnsContainer) {
      var buttons = btnsContainer.querySelectorAll('button');
      var acceptBtn = null;
      var secondaryBtns = [];

      for (var k = 0; k < buttons.length; k++) {
        var btn = buttons[k];
        var txt = btn.textContent.trim().toLowerCase();
        if (txt.indexOf('accetta') !== -1) {
          btn.classList.add('aequo-cookie-accept');
          acceptBtn = btn;
        } else {
          btn.classList.add('aequo-cookie-link');
          secondaryBtns.push(btn);
        }
      }

      if (acceptBtn) {
        btnsContainer.insertBefore(acceptBtn, btnsContainer.firstChild);
      }

      if (secondaryBtns.length > 1) {
        var linkRow = document.createElement('div');
        linkRow.className = 'aequo-cookie-linkrow';
        for (var m = 0; m < secondaryBtns.length; m++) {
          if (m > 0) {
            var sep = document.createElement('span');
            sep.className = 'aequo-cookie-sep';
            sep.textContent = '|';
            linkRow.appendChild(sep);
          }
          linkRow.appendChild(secondaryBtns[m]);
        }
        btnsContainer.appendChild(linkRow);
      }
    }

    banner.classList.add('aequo-cookie-ready');
    return true;
  }

  /* ------------------------------------------------------------------
   * AEQUO PDP — Share toggle handler
   * ------------------------------------------------------------------ */
  var shareToggles = document.querySelectorAll('.js-aequo-share-toggle');
  shareToggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      var parent = toggle.closest('.ProductForm__Share');
      if (!parent) return;
      var list = parent.querySelector('.ProductForm__ShareList');
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      if (list) {
        list.style.display = !expanded ? 'flex' : 'none';
      }
    });
  });

  /* ------------------------------------------------------------------
   * AEQUO PDP — Copy link handler
   * ------------------------------------------------------------------ */
  var copyLinks = document.querySelectorAll('.js-aequo-copy-link');
  copyLinks.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var url = btn.getAttribute('data-url');
      var label = btn.querySelector('.js-aequo-copy-label');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function() {
          if (label) { label.textContent = 'Link Copiato!'; }
          setTimeout(function() { if (label) { label.textContent = 'Copia Link'; } }, 2000);
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          if (label) { label.textContent = 'Link Copiato!'; }
          setTimeout(function() { if (label) { label.textContent = 'Copia Link'; } }, 2000);
        } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  var schedule = window.requestIdleCallback || function(cb) { setTimeout(cb, 100); };
  schedule(function() {
    if (!styleCookieBanner()) {
      var obs = new MutationObserver(function() {
        if (styleCookieBanner()) {
          obs.disconnect();
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  });

  /* ------------------------------------------------------------------
   * AEQUO: force slideshow video to fullscreen on mobile
   * ------------------------------------------------------------------ */
  function forceSlideshowVideoFullscreen() {
    if (window.innerWidth > 640) return;
    var videos = document.querySelectorAll('video.Slideshow__Image');
    videos.forEach(function(video) {
      var container = video.closest('.Slideshow__ImageContainer');
      if (!container) return;
      container.style.height = '100vh';
      container.style.minHeight = '100vh';
      container.style.maxHeight = '100vh';
      container.style.position = 'relative';
      container.style.overflow = 'hidden';
      container.style.width = '100vw';
      container.style.paddingBottom = '0';

      var slide = container.closest('.Slideshow__Slide');
      if (slide) {
        slide.style.height = '100vh';
        slide.style.minHeight = '100vh';
        slide.style.maxHeight = '100vh';
      }

      var carousel = container.closest('.Slideshow__Carousel');
      if (carousel) {
        var viewport = carousel.querySelector('.flickity-viewport');
        if (viewport) {
          viewport.style.height = '100vh';
          viewport.style.minHeight = '100vh';
          viewport.style.maxHeight = '100vh';
        }
        var slider = carousel.querySelector('.flickity-slider');
        if (slider) {
          slider.style.height = '100vh';
          slider.style.minHeight = '100vh';
          slider.style.maxHeight = '100vh';
        }
      }

      video.style.position = 'absolute';
      video.style.top = '0';
      video.style.left = '0';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.minWidth = '100%';
      video.style.minHeight = '100%';
      video.style.maxWidth = 'none';
      video.style.maxHeight = 'none';
      video.style.objectFit = 'cover';
      video.style.objectPosition = 'center';
      video.style.opacity = '1';
      video.style.visibility = 'visible';
      video.style.display = 'block';
    });
  }

  forceSlideshowVideoFullscreen();
  setTimeout(forceSlideshowVideoFullscreen, 500);
  setTimeout(forceSlideshowVideoFullscreen, 1500);
  window.addEventListener('resize', forceSlideshowVideoFullscreen);

  /* ------------------------------------------------------------------
   * AEQUO: horizontal scroll arrows for product grids
   * ------------------------------------------------------------------ */
  (function initProductGridArrows() {
    var wrappers = document.querySelectorAll('.ProductListWrapper');
    wrappers.forEach(function(wrapper) {
      var grid = wrapper.querySelector('.ProductList--grid');
      if (!grid || grid.children.length <= 1) return;
      if (wrapper.classList.contains('ProductListScroll')) return;

      wrapper.classList.add('ProductListScroll');

      var prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'ProductListScroll__Arrow ProductListScroll__Arrow--prev';
      prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
      prevBtn.setAttribute('aria-label', 'Previous products');

      var nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'ProductListScroll__Arrow ProductListScroll__Arrow--next';
      nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
      nextBtn.setAttribute('aria-label', 'Next products');

      function scrollByItems(direction) {
        var item = grid.children[0];
        if (!item) return;
        var gap = 4;
        var itemWidth = item.offsetWidth + gap;
        var viewportWidth = grid.clientWidth;
        var visibleItems = Math.floor(viewportWidth / itemWidth) || 1;
        grid.scrollBy({ left: direction * itemWidth * visibleItems, behavior: 'smooth' });
      }

      prevBtn.addEventListener('click', function() { scrollByItems(-1); });
      nextBtn.addEventListener('click', function() { scrollByItems(1); });

      function updateArrows() {
        var maxScroll = grid.scrollWidth - grid.clientWidth;
        prevBtn.setAttribute('aria-hidden', grid.scrollLeft <= 5 ? 'true' : 'false');
        nextBtn.setAttribute('aria-hidden', grid.scrollLeft >= maxScroll - 5 ? 'true' : 'false');
      }

      updateArrows();

      wrapper.appendChild(prevBtn);
      wrapper.appendChild(nextBtn);

      grid.addEventListener('scroll', updateArrows);
      window.addEventListener('resize', updateArrows);
    });
  })();

});