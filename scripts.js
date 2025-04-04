document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector("nav ul");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("show");
  });

  document.querySelectorAll("nav ul li a").forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("show");
    });
  });
  // Go to Top functionality
  const goToTopButton = document.getElementById("goToTop");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      goToTopButton.classList.add("active");
    } else {
      goToTopButton.classList.remove("active");
    }
  });

  goToTopButton.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
