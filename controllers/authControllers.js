const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authController = {
  //RegisterUser
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //Create new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      //Save to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //Genera Access Token
  generaAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30s" }
    );
  },
  //Genera Refresh Token
  generaRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "30s" }
    );
  },

  //LoginUser
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!user) {
        res.status(404).json("Wrong username!");
      }
      if (!validPassword) {
        res.status(404).json("Wrong password!");
      }
      if (user && validPassword) {
        const accessToken = authController.generaAccessToken(user.id);
        const refreshToken = authController.generaRefreshToken(user.id);

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = authController;
