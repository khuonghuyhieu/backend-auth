const User = require("../models/User");

const userController = {
  getAllUser: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const idUser = await User.findById(req.param.id);
      res.status(200).json("Delete user successfully");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
