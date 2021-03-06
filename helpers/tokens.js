const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return JWT from user data */

function createToken(username) {

  let payload = { username };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
