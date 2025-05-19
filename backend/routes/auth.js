const AuthController = require("../controllers/authController");

const routes = [
  {
    method: "POST",
    path: "/register",
    handler: AuthController.register,
    options: {
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/login",
    handler: AuthController.login,
    options: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/me",
    handler: AuthController.getCurrentUser,
  },
];

module.exports = routes;
