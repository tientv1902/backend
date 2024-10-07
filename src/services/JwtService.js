const jwt = require('jsonwebtoken');


const gennerralAccessToken = (payload) => {
    const access_token = jwt.sign(
        { payload }, 
        'access_token', 
        { expiresIn: '1h' }
    );
    return access_token;  
};
const gennerralRefreshToken = (payload) => {
    const refresh_token = jwt.sign(
        { payload }, 
        'access_token', 
        { expiresIn: '365d' }
    );
    return refresh_token;  
};

module.exports = {
    gennerralAccessToken,
    gennerralRefreshToken
};
