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
};

module.exports = middlewareControllers;
