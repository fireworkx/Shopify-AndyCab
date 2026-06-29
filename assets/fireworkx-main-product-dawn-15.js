const productPageContainer = document.querySelector(".fwx-main-product");
const variantLabels = productPageContainer.querySelectorAll(".variant-selector-radio");
const desktopMediaContainer = productPageContainer.querySelector(".product__media-list");
const desktopThumbnailList = productPageContainer.querySelector(".thumbnail-list").querySelectorAll(".thumbnail-list__item");
const desktopVideos = desktopMediaContainer.querySelectorAll("video");
let slideStepCountMobile = 0;
let slideStepCountDesktop = 0;
const totalSlides = productPageContainer.querySelector(".thumbnail-list").querySelectorAll("li").length;
const prevSlideMobile = productPageContainer.querySelector(".test");
const nextSlideMobile = productPageContainer.querySelector(".test");
const prevSlideDesktop = productPageContainer.querySelector(".slider-button--prev-desktop");
const nextSlideDesktop = productPageContainer.querySelector(".slider-button--next-desktop");


// Fix: variant image switching for fireworkx-main-product-dawn-15 template
// Root cause: product-info.js uses this.querySelector() to find media gallery slides,
// but media-gallery is a SIBLING of product-info (not a descendant), so it returns null.
// This patch overrides updateMedia to use document-level search instead.
(function fixVariantImageSwitching() {
  function applyPatch(pi) {
    if (!pi || pi._variantImagePatchApplied) return;
    pi._variantImagePatchApplied = true;

    var originalUpdateMedia = pi.updateMedia.bind(pi);

    pi.updateMedia = function(html, variantFeaturedMediaId) {
      originalUpdateMedia(html, variantFeaturedMediaId);

      var sectionId = pi.dataset.section;
      var mg = document.getElementById('MediaGallery-' + sectionId);
      if (!mg) return;

      var sliderList = mg.querySelector('slider-component ul.slider') ||
                       mg.querySelector('slider-component ul') ||
                       mg.querySelector('ul.slider') ||
                       mg.querySelector('ul');
      if (!sliderList) return;

      var sourceLis = html ? Array.from(html.querySelectorAll('li[data-media-id]')) : [];
      var destLis = Array.from(sliderList.querySelectorAll('li[data-media-id]'));
      if (sourceLis.length === 0) return;

      // Add missing slides
      sourceLis.forEach(function(sourceLi, sourceIndex) {
        var mediaId = sourceLi.getAttribute('data-media-id');
        if (!sliderList.querySelector('li[data-media-id="' + mediaId + '"]')) {
          if (sourceIndex === 0) {
            sliderList.insertBefore(sourceLi.cloneNode(true), sliderList.firstChild);
          } else {
            var prevId = sourceLis[sourceIndex - 1].getAttribute('data-media-id');
            var prevEl = sliderList.querySelector('li[data-media-id="' + prevId + '"]');
            if (prevEl) {
              sliderList.insertBefore(sourceLi.cloneNode(true), prevEl.nextSibling);
            } else {
              sliderList.appendChild(sourceLi.cloneNode(true));
            }
          }
        }
      });

      // Remove obsolete slides
      Array.from(sliderList.querySelectorAll('li[data-media-id]')).forEach(function(destLi) {
        var mediaId = destLi.getAttribute('data-media-id');
        if (!sourceLis.some(function(s) { return s.getAttribute('data-media-id') === mediaId; })) {
          destLi.parentNode.removeChild(destLi);
        }
      });

      // Activate the featured media slide
      if (variantFeaturedMediaId && mg.setActiveMedia) {
        mg.setActiveMedia(sectionId + '-' + variantFeaturedMediaId, true);
      }
    };
  }

  function patchAll() {
    document.querySelectorAll('product-info').forEach(applyPatch);
  }

  if (customElements.get('product-info')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', patchAll, { once: true });
    } else {
      patchAll();
    }
  } else {
    customElements.whenDefined('product-info').then(function() { setTimeout(patchAll, 50); });
  }
})();