const jwt = require('jsonwebtoken');
require('dotenv').config();

function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' }, (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        });
    });
}

module.exports = createAccessToken;