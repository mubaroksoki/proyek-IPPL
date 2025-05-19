const WishlistController = require("../controllers/wishlistController");

const routes = [
  {
    method: "GET",
    path: "/wishlist",
    handler: WishlistController.getWishlist,
  },
  {
    method: "POST",
    path: "/wishlist/{parfumId}",
    handler: WishlistController.addToWishlist,
  },
  {
    method: "DELETE",
    path: "/wishlist/{parfumId}",
    handler: WishlistController.removeFromWishlist,
  },
];

module.exports = routes;
