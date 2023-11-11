const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

let refreshTokens = [];

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
      { expiresIn: "20s" }
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
        refreshTokens.push(refreshToken);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //refresh token
  requestRefreshToken: (req, res) => {
    //Take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authentication");

    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      // Create new accessToken, refresh token
      const newAccessToken = authController.generaAccessToken(user);
      const newRefreshToken = authController.generaRefreshToken(user);
      refreshTokens.push(newRefreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      res.status(200).json({ accessToken: newAccessToken });
    });
  },

  userLogout: (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("Logged out successfully");
  },
};

module.exports = authController;
