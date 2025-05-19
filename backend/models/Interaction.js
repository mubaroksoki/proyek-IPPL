const { getConnection, sql } = require('../database/connection');

class Interaction {
  /**
   * Track user interaction with a perfume
   * @param {number} userId - User ID
   * @param {number} parfumId - Perfume ID
   * @param {string} actionType - Type of interaction (e.g., 'view', 'purchase')
   * @returns {Promise<void>}
   */
  static async track(userId, parfumId, actionType) {
    const pool = await getConnection();
    
    try {
      await pool.request()
        .input('user_id', sql.Int, userId)
        .input('parfum_id', sql.Int, parfumId)
        .input('action_type', sql.NVarChar(50), actionType)
        .query(`
          INSERT INTO interactions (user_id, parfum_id, action_type, timestamp)
          VALUES (@user_id, @parfum_id, @action_type, GETDATE())
        `);
    } catch (error) {
      console.error('Error tracking interaction:', error);
      throw error;
    }
  }

  /**
   * Get user's interaction history
   * @param {number} userId - User ID
   * @param {number} limit - Maximum number of results to return (default: 10)
   * @returns {Promise<Array>} Array of perfume objects
   */
  static async getUserHistory(userId, limit = 10) {
    const pool = await getConnection();
    
    try {
      const result = await pool.request()
        .input('user_id', sql.Int, userId)
        .input('limit', sql.Int, limit)
        .query(`
          SELECT TOP (@limit) p.*
          FROM interactions i
          INNER JOIN parfums p ON i.parfum_id = p.parfum_id
          WHERE i.user_id = @user_id
          ORDER BY i.timestamp DESC
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Error getting user history:', error);
      throw error;
    }
  }

  /**
   * Track recommendation view interaction
   * @param {number} userId - User ID
   * @param {number|null} parfumId - Perfume ID (optional)
   * @returns {Promise<void>}
   */
  static async trackRecommendationView(userId, parfumId = null) {
    const pool = await getConnection();
    
    try {
      const request = pool.request()
        .input('user_id', sql.Int, userId)
        .input('action_type', sql.NVarChar(50), 'recommendation_view');

      if (parfumId) {
        await request
          .input('parfum_id', sql.Int, parfumId)
          .query(`
            INSERT INTO interactions (user_id, parfum_id, action_type, timestamp)
            VALUES (@user_id, @parfum_id, @action_type, GETDATE())
          `);
      } else {
        // Use default perfume ID if none provided
        await request
          .input('parfum_id', sql.Int, 1) // Replace with your actual default perfume ID
          .query(`
            INSERT INTO interactions (user_id, parfum_id, action_type, timestamp)
            VALUES (@user_id, @parfum_id, @action_type, GETDATE())
          `);
      }
    } catch (error) {
      console.error('Error tracking recommendation view:', error);
      throw error;
    }
  }
}

module.exports = Interaction;