// Fungsi untuk toggle password visibility
const passwordToggle = document.querySelector(".password-toggle");
const passwordInput = document.getElementById("password");

passwordToggle.addEventListener("click", function () {
  // Toggle type antara password dan text
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  // Mengubah ikon mata berdasarkan status password
  const eyeIcon = this.querySelector("svg");

  if (type === "text") {
    // Password terlihat (unhide) - menampilkan ikon mata tertutup
    eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            `;
  } else {
    // Password tersembunyi (hide) - menampilkan ikon mata terbuka
    eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            `;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("signupBtn");
  const responseMessage = document.getElementById("responseMessage");

  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = document.getElementById("firstName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validasi sederhana
    if (!name || !email || !password) {
      responseMessage.innerHTML = "<p>Please fill out all fields.</p>";
      return;
    }

    try {
      const res = await fetch(
        "link-backend-aws",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (data.error === false) {
        // Redirect ke halaman register-success dan kirim pesan sebagai query param
        window.location.href = `/register-success?message=${encodeURIComponent(
          data.message
        )}`;
      } else {
        alert("Undefined email or password or name");
      }
    } catch (error) {
      console.error("Error:", error);
      responseMessage.innerHTML =
        "<p>Something went wrong. Please try again later.</p>";
    }
  });
});
