const jwt = require('jsonwebtoken');
require('dotenv').config();

function jwtGenerator(user_id) {
    const payload = {
        user: user_id
    };
    secretOrKey = process.env.jwtSecret;
    return jwt.sign(payload, secretOrKey, { expiresIn: "1hr" });
}

module.exports = jwtGenerator;