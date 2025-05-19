const KatalogController = require("../controllers/katalogController");

const routes = [
  {
    method: "GET",
    path: "/katalog",
    handler: KatalogController.getAllParfums,
    options: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/katalog/search",
    handler: KatalogController.searchParfums,
    options: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/katalog/filter",
    handler: KatalogController.filterParfums,
    options: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/katalog/{parfumId}",
    handler: KatalogController.getParfumDetail,
    options: {
      auth: {
        mode: "optional",
      },
    },
  },
];

module.exports = routes;
