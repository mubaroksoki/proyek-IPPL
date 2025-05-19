const { getConnection, sql } = require('../database/connection');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Create a new user
   * @param {Object} userData - User data {name, email, password}
   * @returns {Promise<number>} The ID of the created user
   */
  static async create({ name, email, password }) {
    const pool = await getConnection();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      const result = await pool.request()
        .input('name', sql.NVarChar(255), name)
        .input('email', sql.NVarChar(255), email)
        .input('password', sql.NVarChar(255), hashedPassword)
        .query(`
          INSERT INTO users (name, email, password) 
          OUTPUT INSERTED.user_id 
          VALUES (@name, @email, @password)
        `);
      
      return result.recordset[0].user_id;
    } catch (error) {
      if (error.number === 2627) { // SQL Server duplicate key error
        throw new Error('Email already exists');
      }
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Find user by email
   * @param {string} email - User's email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByEmail(email) {
    const pool = await getConnection();
    
    try {
      const result = await pool.request()
        .input('email', sql.NVarChar(255), email)
        .query('SELECT * FROM users WHERE email = @email');
      
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findById(userId) {
    const pool = await getConnection();
    
    try {
      const result = await pool.request()
        .input('user_id', sql.Int, userId)
        .query('SELECT * FROM users WHERE user_id = @user_id');
      
      return result.recordset[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Compare password with hashed password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>} True if passwords match
   */
  static async comparePassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw error;
    }
  }

  /**
   * Get or create user's wishlist
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Wishlist object
   */
  static async getOrCreateWishlist(userId) {
    const pool = await getConnection();
    
    try {
      // Check if wishlist exists
      const checkResult = await pool.request()
        .input('user_id', sql.Int, userId)
        .query('SELECT * FROM wishlists WHERE user_id = @user_id');
      
      if (checkResult.recordset[0]) {
        return checkResult.recordset[0];
      }
      
      // Create new wishlist if not exists
      const insertResult = await pool.request()
        .input('user_id', sql.Int, userId)
        .query(`
          INSERT INTO wishlists (user_id) 
          OUTPUT INSERTED.wishlist_id, INSERTED.user_id
          VALUES (@user_id)
        `);
      
      return insertResult.recordset[0];
    } catch (error) {
      console.error('Error with wishlist operation:', error);
      throw error;
    }
  }
}

module.exports = User;