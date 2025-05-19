const RekomendasiController = require("../controllers/rekomendasiController");

const routes = [
  {
    method: "POST",
    path: "/rekomendasi",
    handler: RekomendasiController.getRecommendations,
  },
  {
    method: "GET",
    path: "/rekomendasi/auto",
    handler: RekomendasiController.getAutoRecommendations,
  },
  {
    method: "GET",
    path: "/rekomendasi/trending",
    handler: RekomendasiController.getTrendingParfums,
    options: {
      auth: false,
    },
  },
];

module.exports = routes;
