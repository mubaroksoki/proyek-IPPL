const hamburgerMenu = document.querySelector(".hamburger-menu");
const nav = document.querySelector("nav");
const body = document.querySelector("body");

if (hamburgerMenu && nav) {
  hamburgerMenu.addEventListener("click", function (e) {
    e.stopPropagation();
    this.classList.toggle("active");
    nav.classList.toggle("active");
    body.classList.toggle("nav-active");
  });

  // Close menu when clicking on a nav link
  const navLinks = document.querySelectorAll("nav ul li a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburgerMenu.classList.remove("active");
      nav.classList.remove("active");
      body.classList.remove("nav-active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (!nav.contains(event.target) && !hamburgerMenu.contains(event.target)) {
      hamburgerMenu.classList.remove("active");
      nav.classList.remove("active");
      body.classList.remove("nav-active");
    }
  });
}
