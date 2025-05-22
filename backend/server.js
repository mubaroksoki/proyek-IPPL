const Hapi = require("@hapi/hapi");
const hapiAuthJWT = require("hapi-auth-jwt2");
const inert = require("@hapi/inert");
const vision = require("@hapi/vision");
const hapiSwagger = require("hapi-swagger");
const JWT = require("jsonwebtoken");
const Boom = require("@hapi/boom");
const bcrypt = require("bcryptjs");
const db = require("./database/connection");

// Import routes
const authRoutes = require("./routes/auth");
const katalogRoutes = require("./routes/katalog");
const rekomendasiRoutes = require("./routes/rekomendasi");
const wishlistRoutes = require("./routes/wishlist");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"],
        credentials: true,
      },
    },
  });

  // Register plugins
  await server.register([
    inert,
    vision,
    {
      plugin: hapiSwagger,
      options: {
        info: {
          title: "Parfum Recommendation API",
          version: "1.0",
        },
      },
    },
    hapiAuthJWT,
  ]);

  // JWT Authentication Strategy
  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET || "your_jwt_secret_key",
    validate: async (decoded, request, h) => {
      try {
        const [user] = await db("users").where("user_id", decoded.user_id);
        if (!user) {
          return { isValid: false };
        }
        return { isValid: true, credentials: user };
      } catch (err) {
        return { isValid: false };
      }
    },
    verifyOptions: { algorithms: ["HS256"] },
  });

  server.auth.default("jwt");

  // Register routes
  server.route([
    ...authRoutes,
    ...katalogRoutes,
    ...rekomendasiRoutes,
    ...wishlistRoutes,
  ]);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
