const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
require("dotenv/config");

exports.cryptoEncrypt = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    "accessTokenSecret",
  ).toString();
};
exports.cryptoDecrypt = (ciphertext) => {
  var bytes = CryptoJS.AES.decrypt(ciphertext, "accessTokenSecret");
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

exports.createToken = (data) => {
  // jwt expires in 1 hour
  const time = "10h";

  const token = jwt.sign(data, "accessTokenSecret", { expiresIn: time });
  return token;
};