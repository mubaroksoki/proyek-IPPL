const User = require("../models/User");
const JWT = require("jsonwebtoken");
const Boom = require("@hapi/boom");

class AuthController {
  static async register(request, h) {
    try {
      const { name, email, password } = request.payload;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return Boom.conflict("Email already registered");
      }

      const userId = await User.create({ name, email, password });

      // Create token
      const token = JWT.sign(
        { user_id: userId },
        process.env.JWT_SECRET || "your_jwt_secret_key",
        {
          expiresIn: "7d",
        }
      );

      return h
        .response({
          status: "success",
          message: "User registered successfully",
          data: {
            token,
          },
        })
        .code(201);
    } catch (error) {
      return Boom.badImplementation(error.message);
    }
  }

  static async login(request, h) {
    try {
      const { email, password } = request.payload;

      const user = await User.findByEmail(email);
      if (!user) {
        return Boom.unauthorized("Invalid email or password");
      }

      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return Boom.unauthorized("Invalid email or password");
      }

      // Create token
      const token = JWT.sign(
        { user_id: user.user_id },
        process.env.JWT_SECRET || "your_jwt_secret_key",
        {
          expiresIn: "7d",
        }
      );

      return {
        status: "success",
        message: "Login successful",
        data: {
          token,
          user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
          },
        },
      };
    } catch (error) {
      return Boom.badImplementation(error.message);
    }
  }

  static async getCurrentUser(request, h) {
    try {
      const user = request.auth.credentials;
      return {
        status: "success",
        data: {
          user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
          },
        },
      };
    } catch (error) {
      return Boom.badImplementation(error.message);
    }
  }
}

module.exports = AuthController;
