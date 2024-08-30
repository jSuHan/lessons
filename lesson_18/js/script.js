

document.addEventListener('click', function (e) {
  const targetElement = e.target;
  if (targetElement.closest('.menu-icon')) {
    document.documentElement.classList.toggle('menu-open');
  }
});
const header = document.querySelector(".header");
window.addEventListener("scroll", scrollPage);

function scrollPage(e) {
  const verticalScroll = window.scrollY;
  if (verticalScroll > 0) {
    header.classList.add("_scroll");
  } else {
    header.classList.remove("_scroll");
  }
};
const searchButton = document.querySelector(".top-header__search-button");

searchButton.addEventListener("click", function (e) {
  const targetElement = e.target;
  if (targetElement.closest(".header")) {
    header.classList.toggle("_open-search");
  }
});