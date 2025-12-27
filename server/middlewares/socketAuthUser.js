const jwt = require("jsonwebtoken")
const User = require("../models/User");
const { errorResponse } = require("../utils/responseWrapper");
 const socketAuthUser = async(socket,next)=>{
        try {
               
                const tokenString = socket.handshake.headers.cookie
                const token = tokenString.split("; ").find(row=>row.startsWith("accessToken=")).split("=")[1]

                if(!token){
                        return next(errorResponse(401,"Access token is required"))
                }

                const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_PRIVATE_KEY)

                if(!decoded){
                        return next(errorResponse(401,"Invalid access token"))
                }

                const user = await User.findById(decoded._id).select("-password")

                if(!user){
                        return next(errorResponse(404,"User not found"))
                }
                
                socket.user = user
                socket.userId = user._id.toString()

                // console.log(`Socket authenticated for the user : ${user?.fullName} (${user?._id})`);

                next()

        } catch (error) {
                console.log(`Error from socketAuthUser : ${error}`);
                return next( errorResponse(500,`Error from socketAuthUser : ${error}`))
               
        }
}

module.exports = socketAuthUser