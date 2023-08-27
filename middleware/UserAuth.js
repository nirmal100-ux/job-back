const jwt = require("jsonwebtoken");
module.exports.checkAdmin = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (token) {
      const decode = jwt.decode(token, "tokencrypt");
      if (decode && decode.isEmployee) {
        req.employeeID = decode.userID;
        return next();
      } else {
        return res
          .status(400)
          .json({ status: "error", message: "You are not authorized" });
      }
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "You are not authorized" });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};

module.exports.checkClient = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (token) {
      const decode = jwt.decode(token, "tokencrypt");
      if (decode && decode.isEmployee === false) {
        req.clientID = decode.userID;
        return next();
      } else {
        return res
          .status(400)
          .json({ status: "error", message: "You are not authorized" });
      }
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "You are not authorized" });
    }
  } catch (e) {
    return res.status(400).json({ status: "error", message: `${e}` });
  }
};
