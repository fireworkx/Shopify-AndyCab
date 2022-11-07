// product slider videos  
const slideVideos = document.querySelectorAll(".swiper-slide-video");

// product slider videos 
const thumbnailSwiper = document.querySelector(".fwx-product-thumbs-swiper");
const thumbnails = thumbnailSwiper.querySelectorAll(".swiper-slide");

// buttons
const buttonPrev = document.querySelector(".swiper-button-prev");
const buttonNext = document.querySelector(".swiper-button-next");

// left arrow selected
buttonPrev.addEventListener('click', (e) => {
  
  // stop and reset video
  slideVideos.forEach(video => {
    video.currentTime=0; 
    video.pause();
  });
})

// right arrow selected
buttonNext.addEventListener('click', (e) => {

  // stop and reset video
  slideVideos.forEach(video => {
    video.currentTime=0;
    video.pause();
  });
})

// thumbnail selected
thumbnails.forEach(video => {

  // handle video playback on thumbnail slider
  video.addEventListener('click', (e) => {
  
    // stop and reset video
    slideVideos.forEach(video => {
      video.currentTime=0; 
      video.pause();
    });
  });
});