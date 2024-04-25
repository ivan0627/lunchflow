const jwt = require('jsonwebtoken');
require('dotenv').config();

function jwtGenerator(user_id) {
    const payload = {
        user: user_id
    };
    secretOrPrivateKey = "cat123";
    return jwt.sign(payload, ""+ secretOrPrivateKey, { expiresIn: "1hr" });
}

module.exports = jwtGenerator;