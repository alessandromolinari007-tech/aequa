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
        p.innerHTML = 'Utilizziamo cookie e tecnologie simili per garantirti un\'esperienza di navigazione fluida, personalizzare i contenuti e analizzare il traffico sul nostro sito. Questo ci permette di raffinare le nostre collezioni e offrirti un servizio sempre più su misura per te. Cliccando su "Accetta", acconsenti all\'uso di tutti i cookie.';
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

    return true;
  }

  var schedule = window.requestIdleCallback || function(cb) { setTimeout(cb, 1); };
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