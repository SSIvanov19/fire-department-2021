if (localStorage.activeUser) {
  document.getElementById("userLogin").style.display = "inline";
  document.getElementById("userNotLogin").style.display = "none";
} else {
  document.getElementById("userLogin").style.display = "none";
  document.getElementById("userNotLogin").style.display = "inline";
}

document.addEventListener('DOMContentLoaded', function () {
  bulmaCarousel.attach('#slider', {
    slidesToScroll: 1,
    slidesToShow: 3,
    infinite: true,
  });
  let burger = document.querySelector('.burger');
  let navbar = document.querySelector('.navbar-menu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('is-active');
    navbar.classList.toggle('is-active');
  });
});
