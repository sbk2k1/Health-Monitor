const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return messageError(res, UNAUTHORIZED, "Authorization Required");
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "accessTokenSecret");
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      return messageError(res, UNAUTHORIZED, "Authorization Required");
    }
    req.user = user;
    next();
  } catch (error) {
    return messageError(res, UNAUTHORIZED, "Authorization Required");
  }
};
