document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Jika tidak ada user, arahkan kembali ke halaman login
    window.location.href = "/sign-in";
  } else {
    // Ganti nama user di welcome section
    const welcomeHeader = document.querySelector(".welcome-text h2");
    if (welcomeHeader) {
      welcomeHeader.textContent = `Hello, ${user.name}`;
    }
  }

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/index.ejs";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.name) {
    document.getElementById("userName").textContent = user.name;
  }
});
