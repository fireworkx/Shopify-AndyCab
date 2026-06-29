var swiper = new Swiper(".fwx-product-thumbs-swiper", {
	spaceBetween: 10,
	slidesPerView: 2,
	breakpoints: {
		320: {
			slidesPerView: 3,
			spaceBetween: 8
		},
		375: {
			slidesPerView: 4,
			spaceBetween: 8
		},
		768: {
			slidesPerView: 4,
			spaceBetween: 16
		}
	},
	freeMode: true,
	watchSlidesVisibility: true,
	watchSlidesProgress: true
});

var swiper2 = new Swiper(".fwx-product-images-swiper", {
	spaceBetween: 10,
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev"
	},
	thumbs: {
		swiper: swiper
	},
	pagination: {
		el: ".swiper-pagination",
		clickable: true
	},
	on: {
		slideChange: function () {
			const sliderContainer = document.querySelector(".fwx-product-images-swiper");
			const videos = sliderContainer.querySelectorAll("video");
			const youtubeVideos = sliderContainer.querySelectorAll("iframe");
			gallerySwiper.activeIndex = this.activeIndex;

			// stop and reset all youtube videos
			for(let video of youtubeVideos) {
				if(video) {
					video.src = video.src
				}
			}

			// stop and reset all videos
			for(let video of videos) {
				if(video) {
					video.pause(); 
					video.currentTime = 0;
				}
			}
		}
	}
});



// Variant image switching: slide to the featured image when a variant is selected
(function () {
  var variantPicker = document.querySelector('variant-radios') || document.querySelector('variant-selects');
  if (!variantPicker) return;

  var variantDataEl = variantPicker.querySelector('script[type="application/json"]');
  if (!variantDataEl) {
    // fallback: look in the product form
    variantDataEl = document.querySelector('.product-form script[type="application/json"]');
  }
  if (!variantDataEl) return;

  var variantData = JSON.parse(variantDataEl.textContent);

  function getSlideIndexForMediaId(mediaId) {
    var slides = document.querySelectorAll('.fwx-product-images-swiper .swiper-slide[data-media-id]');
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].dataset.mediaId == mediaId) return i;
    }
    return -1;
  }

  variantPicker.addEventListener('change', function () {
    var selectedVariantId = parseInt(
      variantPicker.querySelector('input[type="radio"]:checked, select')
        ? (variantPicker.querySelector('input[type="radio"]:checked') || variantPicker.querySelector('select')).value
        : null
    );
    var variant = variantData.find(function (v) { return v.id === selectedVariantId; });
    if (!variant || !variant.featured_media) return;
    var slideIndex = getSlideIndexForMediaId(variant.featured_media.id);
    if (slideIndex > -1 && swiper2) swiper2.slideTo(slideIndex);
  });
})();