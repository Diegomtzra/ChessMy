document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.swiper-container', {
      spaceBetween: 10,
      slidesPerView: 1,
      autoplay: {
        delay: 1500,
        disableOnInteraction: false,
      },
      loop: true, // Para que el carrusel sea continuo
    });
  });
  