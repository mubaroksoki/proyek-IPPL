document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".product-container");

  fetch(
    "http://backend-env.eba-y88id5fn.us-east-1.elasticbeanstalk.com/catalog/parfums"
  )
    .then((response) => response.json())
    .then((result) => {
      if (!result.error && result.data && result.data.parfums) {
        const parfums = result.data.parfums;

        container.innerHTML = "";

        parfums.forEach((parfum) => {
          const card = document.createElement("div");
          card.classList.add("product-card");

          card.innerHTML = `
            <img src="${parfum.image_url}" class="product-image" alt="${parfum.name}">
            <div class="product-info">
                <p class="product-category">${parfum.brand_name}</p>
                <h3 class="product-name">${parfum.name}</h3>
                <p class="product-price">$${parfum.price}</p>
            </div>
          `;

          card.addEventListener("click", function () {
            console.log("Clicked on:", parfum.name);
          });

          container.appendChild(card);
        });
      } else {
        container.innerHTML = "<p>Failed to load parfums.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching parfums:", error);
      container.innerHTML = "<p>Error loading parfums.</p>";
    });
});
