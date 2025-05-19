const { getConnection, sql } = require('../database/connection');

class Parfum {
  /**
   * Get all perfumes
   * @returns {Promise<Array>} Array of all perfume objects
   */
  static async getAll() {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .query('SELECT * FROM parfums');
      return result.recordset;
    } catch (error) {
      console.error('Error getting all perfumes:', error);
      throw error;
    }
  }

  /**
   * Get perfume by ID
   * @param {number} parfumId - Perfume ID
   * @returns {Promise<Object|null>} Perfume object or null if not found
   */
  static async getById(parfumId) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('parfum_id', sql.Int, parfumId)
        .query('SELECT TOP 1 * FROM parfums WHERE parfum_id = @parfum_id');
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error getting perfume by ID:', error);
      throw error;
    }
  }

  /**
   * Search perfumes by keyword
   * @param {string} keyword - Search term
   * @returns {Promise<Array>} Array of matching perfume objects
   */
  static async search(keyword) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('keyword', sql.NVarChar(100), `%${keyword}%`)
        .query(`
          SELECT * FROM parfums 
          WHERE name LIKE @keyword 
            OR brand LIKE @keyword 
            OR description LIKE @keyword 
            OR notes LIKE @keyword
        `);
      return result.recordset;
    } catch (error) {
      console.error('Error searching perfumes:', error);
      throw error;
    }
  }

  /**
   * Filter perfumes by brand
   * @param {string} brand - Brand name
   * @returns {Promise<Array>} Array of matching perfume objects
   */
  static async filterByBrand(brand) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('brand', sql.NVarChar(100), brand)
        .query('SELECT * FROM parfums WHERE brand = @brand');
      return result.recordset;
    } catch (error) {
      console.error('Error filtering by brand:', error);
      throw error;
    }
  }

  /**
   * Filter perfumes by gender
   * @param {string} gender - Gender (e.g., 'Male', 'Female', 'Unisex')
   * @returns {Promise<Array>} Array of matching perfume objects
   */
  static async filterByGender(gender) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('gender', sql.NVarChar(50), gender)
        .query('SELECT * FROM parfums WHERE gender = @gender');
      return result.recordset;
    } catch (error) {
      console.error('Error filtering by gender:', error);
      throw error;
    }
  }

  /**
   * Get perfumes sorted by name
   * @returns {Promise<Array>} Array of perfume objects sorted by name
   */
  static async sortByName() {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .query('SELECT * FROM parfums ORDER BY name ASC');
      return result.recordset;
    } catch (error) {
      console.error('Error sorting by name:', error);
      throw error;
    }
  }

  /**
   * Get perfumes sorted by price
   * @returns {Promise<Array>} Array of perfume objects sorted by price
   */
  static async sortByPrice() {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .query('SELECT * FROM parfums ORDER BY price_range ASC');
      return result.recordset;
    } catch (error) {
      console.error('Error sorting by price:', error);
      throw error;
    }
  }

  /**
   * Filter perfumes by notes and price range
   * @param {string} notes - Fragrance notes
   * @param {string} priceRange - Price range category
   * @returns {Promise<Array>} Array of matching perfume objects
   */
  static async getByNotesAndPrice(notes, priceRange) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('notes', sql.NVarChar(255), `%${notes}%`)
        .input('price_range', sql.NVarChar(50), priceRange)
        .query(`
          SELECT * FROM parfums 
          WHERE notes LIKE @notes 
            AND price_range = @price_range
        `);
      return result.recordset;
    } catch (error) {
      console.error('Error filtering by notes and price:', error);
      throw error;
    }
  }

  /**
   * Track user interaction with a perfume
   * @param {number} userId - User ID
   * @param {number} parfumId - Perfume ID
   * @param {string} actionType - Type of interaction
   * @returns {Promise<void>}
   */
  static async trackInteraction(userId, parfumId, actionType) {
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
   * Get trending perfumes
   * @param {number} limit - Number of perfumes to return (default: 5)
   * @returns {Promise<Array>} Array of trending perfume objects
   */
  static async getTrending(limit = 5) {
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('limit', sql.Int, limit)
        .query(`
          SELECT TOP (@limit) p.*, COUNT(i.parfum_id) as interaction_count
          FROM interactions i
          INNER JOIN parfums p ON i.parfum_id = p.parfum_id
          GROUP BY p.parfum_id, p.name, p.brand, p.description, p.gender, p.price_range, p.notes, p.image_url
          ORDER BY interaction_count DESC
        `);
      return result.recordset;
    } catch (error) {
      console.error('Error getting trending perfumes:', error);
      throw error;
    }
  }

  /**
   * Get similar perfumes
   * @param {number} parfumId - Perfume ID to find similar items for
   * @returns {Promise<Array>} Array of similar perfume objects
   */
  static async getSimilar(parfumId) {
    const pool = await getConnection();
    try {
      // First get the base perfume
      const baseResult = await pool.request()
        .input('parfum_id', sql.Int, parfumId)
        .query('SELECT TOP 1 notes FROM parfums WHERE parfum_id = @parfum_id');
      
      if (!baseResult.recordset[0]) return [];

      const primaryNote = baseResult.recordset[0].notes.split(',')[0].trim();
      
      // Then find similar perfumes
      const similarResult = await pool.request()
        .input('primary_note', sql.NVarChar(100), `%${primaryNote}%`)
        .input('parfum_id', sql.Int, parfumId)
        .query(`
          SELECT TOP 5 * FROM parfums 
          WHERE notes LIKE @primary_note 
            AND parfum_id != @parfum_id
        `);
      
      return similarResult.recordset;
    } catch (error) {
      console.error('Error getting similar perfumes:', error);
      throw error;
    }
  }
}

module.exports = Parfum;