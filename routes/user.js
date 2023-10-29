const middlewareControllers = require("../controllers/middlewareControllers");
const userController = require("../controllers/userControllers");

const router = require("express").Router();

router.get("/", middlewareControllers.verifyToken, userController.getAllUser);

router.delete(
  "/:id",
  middlewareControllers.verifyTokenAndAdminAuth,
  userController.deleteUser
);

module.exports = router;
