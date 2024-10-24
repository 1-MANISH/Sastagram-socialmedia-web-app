
const jwt = require("jsonwebtoken")

const generateAccessToken = (data) => {
    // DATA + SECRET_KEY + EXPIRES_TIME

    try {

        const accessToken = jwt.sign(
            data,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            {expiresIn:'35m'}
        )
        return accessToken

    } catch (error) {

        return error
    }
}

const generateRefreshToken = (data) => {
    
    // DATA + SECRET_KEY + EXPIRES_TIME

    try {

        const refreshToken = jwt.sign(
            data,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            {expiresIn:"1 days"}
        )
        return refreshToken

    } catch (error) {
        
        return error
    }
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
}