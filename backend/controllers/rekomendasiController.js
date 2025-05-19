const RecommendationEngine = require("../utils/recommendations");
const Boom = require("@hapi/boom");
const Parfum = require("../models/Parfum");
const Interaction = require("../models/Interaction");

class RekomendasiController {
  static async getRecommendations(request, h) {
    try {
      const userId = request.auth.credentials.user_id;
      const { notes, price_range } = request.payload;

      const recommendations = await RecommendationEngine.getRecommendations(
        userId,
        notes,
        price_range
      );

      // Catat interaksi dengan parfum pertama yang direkomendasikan
      const firstParfumId = recommendations[0]?.parfum_id || 1;
      await Interaction.trackRecommendationView(userId, firstParfumId);

      return {
        status: "success",
        data: { recommendations },
      };
    } catch (error) {
      console.error("Recommendation error:", error);
      return Boom.badImplementation(error.message);
    }
  }

  static async getAutoRecommendations(request, h) {
    try {
      const userId = request.auth.credentials.user_id;

      // Analisis preferensi pengguna
      const preferences = await RecommendationEngine.analyzeUserPreferences(
        userId
      );

      // Dapatkan rekomendasi otomatis
      const recommendations = await RecommendationEngine.getRecommendations(
        userId,
        preferences.preferredNotes,
        preferences.preferredPriceRange
      );

      return {
        status: "success",
        data: {
          recommendations,
          detected_preferences: preferences,
        },
      };
    } catch (error) {
      return Boom.badImplementation(error.message);
    }
  }

  static async getTrendingParfums(request, h) {
    try {
      const trending = await RecommendationEngine.getTrendingParfums();
      return {
        status: "success",
        data: {
          trending,
        },
      };
    } catch (error) {
      return Boom.badImplementation(error.message);
    }
  }
}

module.exports = RekomendasiController;
