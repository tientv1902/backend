const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config()

const gennerralAccessToken = (payload) => {
    const access_token = jwt.sign(
        payload, 
        process.env.ACCESS_TOKEN, 
        { expiresIn: '1h' }
    );
    return access_token;  
};
const gennerralRefreshToken = (payload) => {
    const refresh_token = jwt.sign(
        payload, 
        process.env.REFRESH_TOKEN, 
        { expiresIn: '365d' }
    );
    return refresh_token;  
};

module.exports = {
    gennerralAccessToken,
    gennerralRefreshToken
};
