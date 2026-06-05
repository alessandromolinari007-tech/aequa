if (typeof BOLDCURRENCY !== 'undefined' && BOLDCURRENCY.converter && typeof BOLD_mc_bootstrapSettings !== 'undefined') {
  BOLD_mc_bootstrap(BOLD_mc_bootstrapSettings);
}

function BOLD_mc_bootstrap(options) {

  // inject CSS assets into the head of the document
  injectCssAssets([
    makeCssLink(options.flagsAssetUrl),
    makeCssLink(options.pickerCssAssetUrl)
  ]);

  BOLDCURRENCY.converter.requestRates = function (callback, moneyElements) {
    BOLD.helpers.js.get(options.shopDomainUrl + '/rates')
      .then(
        function (returnedValue) {
          if (returnedValue.hasOwnProperty('error')) {
            console.info('Bold MultiCurrency: ' + returnedValue.error);
            BOLDCURRENCY.enabled = false;
            throw(returnedValue.error);
          } else {
            callback(returnedValue, moneyElements);
            BOLDCURRENCY.converter.enableAggressiveRefresh();
          }
        })
      .catch(function (err) {
        if (true === options.debug) {
          console.log(err);
        }
        BOLDCURRENCY.converter.hideAllInstances();
      });
  };

  BOLDCURRENCY.converter.postCartDataToCashier = function (cartId, callback, moneyElements) {
    BOLD.helpers.js.post(options.shopDomainUrl + '/rates', {'cart_id': cartId})
      .then(
        function (returnedValue) {
          if (returnedValue.hasOwnProperty('error')) {
            console.info('Bold MultiCurrency: ' + returnedValue.error);
            BOLDCURRENCY.enabled = false;
            throw(returnedValue.error);
          } else {
            if (typeof callback === 'function') {
              callback(returnedValue, moneyElements);
              BOLDCURRENCY.converter.enableAggressiveRefresh();
            }
          }
        })
      .catch(function (err) {
        if (true === options.debug) {
          console.log(err);
        }
        BOLDCURRENCY.converter.hideAllInstances();
      });
  };

  if (BOLD && typeof BOLD.helpers !== 'undefined') {
    BOLD.helpers.setupMutationObservers = function (target, eventToEmit) {
      var pending = false;
      var observer = new MutationObserver(function (mutations) {
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () {
          pending = false;
          var select = document.querySelector('select[name=id]');
          if (!select) return;
          var variantId = parseInt(select.value, 10);
          if (isNaN(variantId)) return;
          BOLD.helpers.shopify.getVariant(BOLD.helpers.shopify.getProductHandleById(variantId), variantId)
            .then(function (data) {
              BOLD.common.eventEmitter.emit(eventToEmit, {
                selector: target,
                variant: data,
                originalProductPrice: options.productOriginalPrice
              });
            });
        });
      });

      var config = {childList: true, subtree: true};

      observer.observe(target, config);
    };
  }

  document.addEventListener('DOMContentLoaded', function (event) {
    if (window.jQuery && jQuery().on) {
      jQuery('.bold_product_page_price').parent().each(function (i, parent) {
        BOLD.helpers.setupMutationObservers(parent, 'BOLD_CURRENCY_product_price_updated');
      });
    }

    BOLDCURRENCY.converter.initialize(initPickers());
  });

  function injectCssAssets(assets) {
    var fragment = document.createDocumentFragment();
    assets.forEach(function (asset) {
      fragment.appendChild(asset);
    });
    document.head.appendChild(fragment);
  }

  function initPickers() {
    var pickerTemplateParent = document.getElementById('bold-currency-picker-template');
    var mountpointTemplateParent = document.getElementById('bold-currency-picker-mount-template');

    if (null === pickerTemplateParent) {
      throw 'No picker template found';
    } else if (null === mountpointTemplateParent) {
      throw 'No mountpoint template found';
    }

    // a live HTMLCollection that will automatically reflect DOM updates
    var mountpointInstances = document.getElementsByClassName('BOLD-mc-picker-mnt');
    if (0 === mountpointInstances.length) {
      // inject automatically if necessary
      var injectedMount = document.body.appendChild(getElementFromTemplate(mountpointTemplateParent));
      addClass(injectedMount, 'injected');
    }

    var pickerInstances = [];

    /** @type {Element} instance **/
    Array.prototype.forEach.call(mountpointInstances, function (instance) {
      var appendedChild = instance.appendChild(getElementFromTemplate(pickerTemplateParent));
      appendedChild.style.display = '';
      pickerInstances.push(appendedChild);
    });

    return pickerInstances;
  }

  function makeCssLink(href) {
    var cssLink = document.createElement('link');
    cssLink.type = 'text/css';
    cssLink.rel = 'stylesheet';
    cssLink.href = href;
    return cssLink;
  }

  /**
   * This function requires that the template element contains only one single child element
   * (The child element can contain arbitrary content however)
   *
   * @param {Element} templateElement
   * @return {Node} the top-level child element within the template
   */
  function getElementFromTemplate(templateElement) {
    var tmp = document.createElement('div');
    tmp.innerHTML = templateElement.innerHTML.trim();
    return tmp.firstChild;
  }

  function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }

  function addClass(element, className) {
    if (!hasClass(element, className)) {
      return element.className += ' ' + className;
    }
  }

}
