// utils/recommendations.js
const db = require("../database/connection");
const _ = require("lodash");

class RecommendationEngine {
  /**
   * Mendapatkan rekomendasi parfum berdasarkan preferensi pengguna
   * @param {number} userId - ID pengguna
   * @param {string} preferredNotes - Catatan aroma yang disukai (contoh: "floral,vanilla")
   * @param {string} priceRange - Rentang harga (low, medium, high)
   * @returns {Promise<Array>} - Array parfum yang direkomendasikan
   */
  static async getRecommendations(userId, preferredNotes, priceRange) {
    try {
      // 1. Dapatkan rekomendasi berdasarkan preferensi langsung
      let recommendations = await this.getByPreferences(
        preferredNotes,
        priceRange
      );

      // 2. Jika kurang dari 5, tambahkan berdasarkan riwayat pengguna
      if (recommendations.length < 5) {
        const historyBased = await this.getFromUserHistory(userId);
        recommendations = this.mergeRecommendations(
          recommendations,
          historyBased
        );
      }

      // 3. Jika masih kurang, tambahkan parfum trending
      if (recommendations.length < 5) {
        const trending = await this.getTrendingParfums();
        recommendations = this.mergeRecommendations(recommendations, trending);
      }

      // 4. Remove duplicates dan limit to 10 items
      return _.uniqBy(recommendations, "parfum_id").slice(0, 10);
    } catch (error) {
      console.error("Error in getRecommendations:", error);
      throw error;
    }
  }

  /**
   * Mendapatkan rekomendasi berdasarkan preferensi langsung
   */
  static async getByPreferences(preferredNotes, priceRange) {
    const notesArray = preferredNotes.split(",").map((note) => note.trim());

    // Buat query untuk setiap note dan gabungkan hasilnya
    let results = [];
    for (const note of notesArray) {
      const parfums = await db("parfums")
        .where("notes", "like", `%${note}%`)
        .andWhere("price_range", priceRange)
        .limit(5); // Ambil maksimal 5 per note

      results = [...results, ...parfums];
    }

    return results;
  }

  /**
   * Mendapatkan rekomendasi berdasarkan riwayat pengguna
   */
  static async getFromUserHistory(userId) {
    // Dapatkan 5 parfum terakhir yang dilihat pengguna
    const history = await db("interactions")
      .where("user_id", userId)
      .where("action_type", "view")
      .orderBy("timestamp", "desc")
      .limit(5)
      .pluck("parfum_id");

    if (history.length === 0) return [];

    // Dapatkan parfum yang mirip dengan yang ada di riwayat
    let similarParfums = [];
    for (const parfumId of history) {
      const similar = await this.getSimilarParfums(parfumId);
      similarParfums = [...similarParfums, ...similar];
    }

    return similarParfums;
  }

  /**
   * Mendapatkan parfum yang mirip dengan parfum tertentu
   */
  static async getSimilarParfums(parfumId) {
    const [parfum] = await db("parfums").where("parfum_id", parfumId);
    if (!parfum) return [];

    // Ambil parfum dengan note yang sama (ambil note pertama sebagai acuan)
    const primaryNote = parfum.notes.split(",")[0].trim();
    return db("parfums")
      .where("notes", "like", `%${primaryNote}%`)
      .andWhereNot("parfum_id", parfumId)
      .limit(3); // Ambil 3 parfum yang mirip
  }

  /**
   * Mendapatkan parfum trending
   */
  static async getTrendingParfums() {
    return db("interactions")
      .select("parfums.*")
      .count("interactions.parfum_id as interaction_count")
      .join("parfums", "interactions.parfum_id", "parfums.parfum_id")
      .groupBy("interactions.parfum_id")
      .orderBy("interaction_count", "desc")
      .limit(5);
  }

  /**
   * Menggabungkan array rekomendasi tanpa duplikat
   */
  static mergeRecommendations(arr1, arr2) {
    const merged = [...arr1, ...arr2];
    return _.uniqBy(merged, "parfum_id");
  }

  /**
   * Menganalisis preferensi pengguna berdasarkan riwayat
   */
  static async analyzeUserPreferences(userId) {
    // Dapatkan parfum yang sering dilihat/disukai pengguna
    const frequentParfums = await db("interactions")
      .select("parfums.notes", "parfums.price_range")
      .join("parfums", "interactions.parfum_id", "parfums.parfum_id")
      .where("user_id", userId)
      .groupBy("parfums.parfum_id")
      .orderByRaw("COUNT(*) DESC")
      .limit(5);

    // Ekstrak notes dan price range yang paling sering muncul
    const notes = {};
    const priceRanges = {};

    frequentParfums.forEach((parfum) => {
      parfum.notes.split(",").forEach((note) => {
        const trimmedNote = note.trim();
        notes[trimmedNote] = (notes[trimmedNote] || 0) + 1;
      });

      priceRanges[parfum.price_range] =
        (priceRanges[parfum.price_range] || 0) + 1;
    });

    // Urutkan berdasarkan frekuensi
    const sortedNotes = Object.entries(notes)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0]);

    const sortedPriceRanges = Object.entries(priceRanges)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0]);

    return {
      preferredNotes: sortedNotes.slice(0, 3).join(","),
      preferredPriceRange: sortedPriceRanges[0] || "medium",
    };
  }
}

module.exports = RecommendationEngine;
