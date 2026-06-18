/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 */

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
    var selectors = [
      '.shopify-pc__banner',
      '#shopify-pc__banner',
      '[data-testid="cookie-banner"]'
    ];
    var banner = null;
    for (var i = 0; i < selectors.length; i++) {
      banner = document.querySelector(selectors[i]);
      if (banner) break;
    }

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

});