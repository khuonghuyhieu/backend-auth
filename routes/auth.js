const authController = require("../controllers/authControllers");
const middlewareControllers = require("../controllers/middlewareControllers");

const router = require("express").Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.post("/refresh", authController.requestRefreshToken);

router.post(
  "/logout",
  middlewareControllers.verifyToken,
  authController.userLogout
);

module.exports = router;
