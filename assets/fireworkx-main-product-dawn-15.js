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


// Patch: fix variant image switching by making product-info find media-gallery globally
// Root cause: product-info.js uses this.querySelector("media-gallery") but media-gallery
// is a sibling element (not a descendant), so it returns null and images don't switch.
(function patchProductInfoMediaGallery() {
  function applyPatch() {
    var pi = document.querySelector('product-info');
    if (!pi || !pi.updateMedia) return;

    var originalUpdateMedia = pi.updateMedia.bind(pi);
    pi.updateMedia = function(html, variantFeaturedMediaId) {
      originalUpdateMedia(html, variantFeaturedMediaId);
      // If media-gallery was not found inside product-info (the default querySelector fails),
      // find it by section ID and call setActiveMedia directly
      if (!pi.querySelector('media-gallery') && variantFeaturedMediaId) {
        var sectionId = pi.dataset.section;
        var mg = document.getElementById('MediaGallery-' + sectionId);
        if (mg && mg.setActiveMedia) {
          mg.setActiveMedia(sectionId + '-' + variantFeaturedMediaId, true);
        }
      }
    };
  }

  if (customElements.get('product-info')) {
    // Already defined - wait for DOM to be ready then patch
    document.addEventListener('DOMContentLoaded', applyPatch, { once: true });
    if (document.readyState !== 'loading') applyPatch();
  } else {
    // Wait for product-info custom element to be defined
    customElements.whenDefined('product-info').then(function() {
      // Give it a moment to upgrade elements in the DOM
      setTimeout(applyPatch, 100);
    });
  }
})();