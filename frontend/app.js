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

app.get("/fragrance", (req, res) => {
  res.render("fragrance", {
    fragrances,
    title: "Fragrance Scentara",
    logo: "Scentara",
  });
});

app.get("/home", (req, res) => {
  res.render("home", {
    title: "Home Scentara",
    logo: "Scentara",
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

//Knuth-Morris-Pratt algorithm

function kmp(text, pattern) {
  const build = (p) => {
    let table = Array(p.length).fill(0),
      j = 0;
    for (let i = 1; i < p.length; ) {
      if (p[i] === p[j]) table[i++] = ++j;
      else if (j > 0) j = table[j - 1];
      else i++;
    }
    return table;
  };

  text = text.toLowerCase();
  pattern = pattern.toLowerCase();
  const t = build(pattern);
  let i = 0,
    j = 0;

  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
      if (j === pattern.length) return true;
    } else if (j > 0) {
      j = t[j - 1];
    } else {
      i++;
    }
  }
  return false;
}

app.get("/search", (req, res) => {
  const { type, query } = req.query;
  if (!type || !query) return res.redirect("/");

  let results = [];
  if (type === "name") {
    results = products.filter((item) => kmp(item.name, query));
    res.render("catalog", { title: "Search Result - Name", products: results });
  } else if (type === "category") {
    results = products.filter((item) => kmp(item.category, query));
    res.render("catalog", {
      title: "Search Result - Category",
      products: results,
    });
  } else if (type === "notes") {
    results = fragrances.filter((item) => kmp(item.name, query));
    res.render("fragrance", {
      title: "Search Result - Notes",
      fragrances: results,
    });
  } else {
    res.redirect("/");
  }
});

app.listen(PORT, () => {
  console.log("server running on http://localhost:" + PORT);
});
