const jwt = require("jsonwebtoken")
const { errorResponse } = require("../utils/responseWrapper");
const User = require("../models/User");

const requireUserMiddleware = async(req,res,next)=>{

    console.log(`requireUser middleware called 🎞`);

    try {
        // 1. verify access token every time is required

        if(!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer")){
            return res.status(401).send(errorResponse(401,"Access token is required 🧞‍♂️"))
        }

        const accessToken = req.headers.authorization.split(" ")[1]
    
         const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_PRIVATE_KEY
         )

         // 2. as user has valid access token load user id to each request
        req._id = decoded._id
         
        // 3. verify from database
        const user = await User.findById(decoded._id)

        if(!user){
            return res.status(404).send(errorResponse(404,"User not found"))
        }
        // ACK
        next()
        
    } catch (error) {
        // not a internal error : AT expires 
        // Note : Not send status from here 
        return res.send(errorResponse(401,error.message))

    }
}

module.exports = requireUserMiddleware