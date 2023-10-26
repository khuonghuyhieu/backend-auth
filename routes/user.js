const userController = require("../controllers/userControllers");

const router = require("express").Router();

router.get("/", userController.getAllUser);

router.delete("/:id", userController.deleteUser);

module.exports = router;
