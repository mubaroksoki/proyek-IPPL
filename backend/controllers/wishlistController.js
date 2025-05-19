const User = require("../models/User");
const Wishlist = require("../models/Wishlist");
const Parfum = require("../models/Parfum");
const Boom = require("@hapi/boom");

class WishlistController {
  static async getWishlist(request, h) {
    try {
      const userId = request.auth.credentials.user_id;

      // Get or create wishlist for user
      const { wishlist_id } = await User.getOrCreateWishlist(userId);

      // Get wishlist items
      const items = await Wishlist.getWishlistItems(wishlist_id);

      return {
        status: "success",
        data: {
          wishlist: items,
        },
      };
    } catch (error) {
      return Boom.badImplementation(error.message);
    }
  }

  static async addToWishlist(request, h) {
    try {
      const userId = request.auth.credentials.user_id;
      const { parfumId } = request.params;

      // Check if parfum exists
      const parfum = await Parfum.getById(parfumId);
      if (!parfum) {
        return Boom.notFound("Parfum not found");
      }

      // Get or create wishlist for user
      const { wishlist_id } = await User.getOrCreateWishlist(userId);

      // Check if already in wishlist
      const isInWishlist = await Wishlist.isInWishlist(wishlist_id, parfumId);
      if (isInWishlist) {
        return Boom.conflict("Parfum already in wishlist");
      }

      // Add to wishlist
      await Wishlist.addToWishlist(wishlist_id, parfumId);

      // Track interaction
      await Parfum.trackInteraction(userId, parfumId, "wishlist_add");

      return {
        status: "success",
        message: "Parfum added to wishlist",
      };
    } catch (error) {
      return Boom.badImplementation(error.message);
    }
  }

  static async removeFromWishlist(request, h) {
    try {
      const userId = request.auth.credentials.user_id;
      const { parfumId } = request.params;

      // Get wishlist
      const { wishlist_id } = await User.getOrCreateWishlist(userId);

      // Remove from wishlist
      await Wishlist.removeFromWishlist(wishlist_id, parfumId);

      // Track interaction
      await Parfum.trackInteraction(userId, parfumId, "wishlist_remove");

      return {
        status: "success",
        message: "Parfum removed from wishlist",
      };
    } catch (error) {
      return Boom.badImplementation(error.message);
    }
  }
}

module.exports = WishlistController;
