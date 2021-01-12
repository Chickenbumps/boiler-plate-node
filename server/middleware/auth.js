// Authentication

const { User } = require("../models/User");

let auth = (req, res, next) => {
  // Get the token from client cookie

  // Decoding the token and Find user.
  let token = req.cookies.x_auth;

  // If user exists, Auth ok
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });
    req.token = token;
    req.user = user;
    next();
  });
  // If not, Auth no
};

module.exports = { auth };
