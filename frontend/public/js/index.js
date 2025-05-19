document.addEventListener("DOMContentLoaded", function () {
  // Dropdown functionality
  const dropdownButton = document.getElementById("dropdownButton");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const dropdownIcon = document.querySelector(".dropdown-icon");
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  const selectedOption = document.querySelector(".selected-option");

  // Toggle dropdown menu
  if (dropdownButton) {
    dropdownButton.addEventListener("click", function () {
      dropdownMenu.classList.toggle("open");
      dropdownIcon.classList.toggle("open");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
      const isClickInside =
        dropdownButton.contains(event.target) ||
        dropdownMenu.contains(event.target);

      if (!isClickInside && dropdownMenu.classList.contains("open")) {
        dropdownMenu.classList.remove("open");
        dropdownIcon.classList.remove("open");
      }
    });

    // Select dropdown item
    dropdownItems.forEach((item) => {
      item.addEventListener("click", function () {
        const value = this.getAttribute("data-value");
        selectedOption.textContent = value;

        // Remove selected class from all items
        dropdownItems.forEach((el) => el.classList.remove("selected"));

        // Add selected class to clicked item
        this.classList.add("selected");

        // Close dropdown
        dropdownMenu.classList.remove("open");
        dropdownIcon.classList.remove("open");
      });
    });
  }

  // Hamburger menu functionality
});
