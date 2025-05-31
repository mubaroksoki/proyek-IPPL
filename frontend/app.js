const express = require("express");
const products = require("./data/catalog.json");
const indexs = require("./data/index.json");
const fragrances = require("./data/fragrance.json");
const path = require("path");
const app = express();
const PORT = 3000;

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.render("index", { indexs, title: "Overview", logo: "Scentara" });
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up", { title: "Sign Up Scentara", logo: "Scentara" });
});

app.get("/sign-in", (req, res) => {
  res.render("sign-in", { title: "Sign in Scentara", logo: "Scentara" });
});

app.get("/catalog", (req, res) => {
  res.render("catalog", {
    products,
    title: "Catalog Scentara",
    logo: "Scentara",
  });
});

app.get("/catalog-login", (req, res) => {
  res.render("catalog-login", {
    title: "Catalog Scentara",
    logo: "Scentara",
    request: req,
  });
});

app.get("/register-success", (req, res) => {
  const message = req.query.message || "User registered successfully";
  res.render("register-success", {
    title: "Register Success",
    logo: "Scentara",
    message,
  });
});

app.get("/fragrance", (req, res) => {
  res.render("fragrance", {
    fragrances,
    title: "Fragrance Scentara",
    logo: "Scentara",
  });
});

app.get("/fragrance-login", (req, res) => {
  res.render("fragrance-login", {
    title: "Fragrance Scentara",
    logo: "Scentara",
    request: req,
  });
});

app.get("/home", (req, res) => {
  res.render("home", {
    title: "Home Scentara",
    logo: "Scentara",
    request: req,
  });
});

app.get("/scent-matcher", (req, res) => {
  const page = req.query.page;
  const showPage1 = page === "1";
  const showPage2 = page === "2";
  const showPage3 = page === "3";
  const showPage4 = page === "4";

  res.render("scent-matcher", {
    title: "Scent Matcher",
    logo: "Scentara",
    showPage1,
    showPage2,
    showPage3,
    showPage4,
  });
});

app.get("/scent-matcher-login", (req, res) => {
  const page = req.query.page;
  const showPage5 = page === "5";
  const showPage6 = page === "6";
  const showPage7 = page === "7";
  const showPage8 = page === "8";

  res.render("scent-matcher-login", {
    title: "Scent Matcher",
    logo: "Scentara",
    request: req,
    showPage5,
    showPage6,
    showPage7,
    showPage8,
  });
});

app.listen(PORT, () => {
  console.log("server running on http://localhost:" + PORT);
});
