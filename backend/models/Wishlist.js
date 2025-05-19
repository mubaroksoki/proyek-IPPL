const { getConnection, sql } = require('../database/connection');

class Wishlist {
  /**
   * Add perfume to wishlist
   * @param {number} wishlistId - Wishlist ID
   * @param {number} parfumId - Perfume ID
   * @returns {Promise<void>}
   */
  static async addToWishlist(wishlistId, parfumId) {
    const pool = await getConnection();
    try {
      await pool.request()
        .input('wishlist_id', sql.Int, wishlistId)
        .input('parfum_id', sql.Int, parfumId)
        .query(`
          INSERT INTO wishlist_parfum (wishlist_id, parfum_id)
          VALUES (@wishlist_id, @parfum_id)
        `);
    } catch (error) {
      if (error.number === 2627) { // SQL Server duplicate key error
        throw new Error('This perfume is already in the wishlist');
      }
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  /**
   * Remove perfume from wishlist
   * @param {number} wishlistId - Wishlist ID
   * @param {number} parfumId - Perfume ID
   * @returns {Promise<void>}
   */
  static async removeFromWishlist(wishlistId, parfumId) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('wishlist_id', sql.Int, wishlistId)
        .input('parfum_id', sql.Int, parfumId)
        .query(`
          DELETE FROM wishlist_parfum
          WHERE wishlist_id = @wishlist_id
            AND parfum_id = @parfum_id
        `);
      
      if (result.rowsAffected[0] === 0) {
        throw new Error('Item not found in wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  /**
   * Get all items in wishlist
   * @param {number} wishlistId - Wishlist ID
   * @returns {Promise<Array>} Array of perfume objects in the wishlist
   */
  static async getWishlistItems(wishlistId) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('wishlist_id', sql.Int, wishlistId)
        .query(`
          SELECT p.*
          FROM wishlist_parfum wp
          INNER JOIN parfums p ON wp.parfum_id = p.parfum_id
          WHERE wp.wishlist_id = @wishlist_id
        `);
      return result.recordset;
    } catch (error) {
      console.error('Error getting wishlist items:', error);
      throw error;
    }
  }

  /**
   * Check if perfume exists in wishlist
   * @param {number} wishlistId - Wishlist ID
   * @param {number} parfumId - Perfume ID
   * @returns {Promise<boolean>} True if perfume exists in wishlist
   */
  static async isInWishlist(wishlistId, parfumId) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('wishlist_id', sql.Int, wishlistId)
        .input('parfum_id', sql.Int, parfumId)
        .query(`
          SELECT 1
          FROM wishlist_parfum
          WHERE wishlist_id = @wishlist_id
            AND parfum_id = @parfum_id
        `);
      return result.recordset.length > 0;
    } catch (error) {
      console.error('Error checking wishlist:', error);
      throw error;
    }
  }
}

module.exports = Wishlist;