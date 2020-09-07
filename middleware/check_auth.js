require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretJwt = process.env.SECRET_TOKEN;

exports.check_token = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!req.headers.authorization)
    return res.status(403).json({
      message: "Error: Credentials",
      result: "No credentials sent!",
    });
  else {
    jwt.verify(token, secretJwt, (err, decoded) => {
      if (!err) {
        req.user_token = decoded;
        next();
      } else {
        return res.status(403).json({
          message: "Error: Credentials",
          result: err,
        });
      }
    });
  }
};
