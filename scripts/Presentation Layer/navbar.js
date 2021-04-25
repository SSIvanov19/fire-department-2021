am = new AccountManager(localStorage);

if (am.checkForEnterUser() == "true") {
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

let stateCheck = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(stateCheck);
    document.getElementsByClassName("progress")[0].style.display = "none";
  }
}, 100);
