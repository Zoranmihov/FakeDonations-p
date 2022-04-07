const { sign, verify } = require("jsonwebtoken");
let jwtSecret = "AveryBadSecret13!";

let createToken = (user) => {
  const acessToken = sign({ id: user._id }, jwtSecret);
  return acessToken;
};

const validateToken = (req, res, next) => {
  if (!req.headers.cookie) {
    return;
  } else {
    let cookie = req.headers.cookie.split(";").filter((cookie) => {
      return cookie.includes("access-token");
    });
    cookie = cookie.toString().split("=")[1];
    if (!cookie) {
      res
        .status(400)
        .json({ message: "Bad token" })
        .cookie("access-token", "", { maxAge: 1 });
    }
    try {
      let decoded = verify(cookie, jwtSecret);
      req.userId = decoded.id;
      next();
    } catch (error) {
      console.log(error.message);
      res
        .status(401)
        .cookie("access-token", "", { maxAge: 1 })
        .json({ message: "Not authorized" });
    }
  }
};

module.exports = { createToken, validateToken };
