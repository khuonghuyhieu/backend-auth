const jwt = require("jsonwebtoken");

const middlewareControllers = {
  //verifyToken
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      // Bearer 1234111
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.status(403).json("Token is not valid ");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You're not authentication");
    }
  },

  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareControllers.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("You're not allowed to delete other");
      }
    });
  },
};

module.exports = middlewareControllers;
