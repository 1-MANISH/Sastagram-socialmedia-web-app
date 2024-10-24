const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User");
const { errorResponse, successResponse } = require("../utils/responseWrapper");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");


const signupController = async (req,res)=>{

    try {

        console.log(`signupController called 🚛 `);

        // 1. Get required field from req body
        const {name,email,password} = req.body

        // 2. Check Validation

        // 2.1 Field Check
        if(!name || !email || !password){
           return res.send(errorResponse(400,"Please send required field 👿"))
        }

        // 2.2 Already exist with same email because email should be unique
        const oldUser = await User.findOne({email})
        if(oldUser){
            return res.send(errorResponse(409,"User Already exist with same credentials 😱"))
        }

        // 3. Convert password to HASH password
        const hashPassword = await bcrypt.hash(password,10)

        // 4. save details to DB or make user entry to DB
        const userCreated = await User.create({
            name,
            email,
            password:hashPassword,
        })
        // 5. ACK
       return res.send(successResponse(201,userCreated))

    } catch (error) {
        return res.send(errorResponse(500,error))
    }
}

const loginController = async (req,res)=>{
    console.log(`loginController called 🏳‍🌈`);

    try {

        // 1. Get required field from req body
        const {email,password} = req.body

        // 2. Check Validation

        // 2.1 field check
        if(!email || !password){
            return res.send(errorResponse(400,"Please send required field 👿"))
        }

        // 2.2 User account created or not : registered or not
        const user = await User.findOne({email})
        if(!user){
            return res.send(errorResponse(404,"User is not registered 😂"))
        }

        // 2.3 password match
        const matched  = await bcrypt.compare(password,user.password)
        if(!matched){
            return res.send(errorResponse(403,"Password is wrong 😂"))
        }

        // 3. Generate access token : save in local storage from FrontEnd

        const accessToken = generateAccessToken({
            _id :user._id
        })

        // 4.  Generate refresh token : save to cookies : from BackEnd
        const refreshToken = generateRefreshToken({
            _id:user._id
        })

        // 5. Set this to cookies in frontend

        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            secure:true
        })

        // ACK
        return res.send(successResponse(200,{accessToken}))

    } catch (error) {

        return res.send(errorResponse(500,error.message))
    }
    
}

const refreshAccessTokenController = async(req,res)=>{
    console.log(`refreshAccessConroller called 🗽`);
    try {

        // 1. first get cookies
        const cookies = req.cookies

        if(!cookies.refreshToken){
            return res.send(errorResponse(401,"Refresh token required 🙄"))
        }

        // 2. extract jwt token - RT
        const refreshToken = cookies.refreshToken

        // 3. now decode it : it will verify and gives what we had passed
        const decode = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_PRIVATE_KEY
        )
        // 4. now get user id
        const userID = decode._id

        // 5. create new access token
        const newAccessToken = generateAccessToken({
            _id:userID
        })

        // ACK
        return res.send(successResponse(201,{newAccessToken}))
        
    } catch (error) {  
        // RT expires
        return res.send(errorResponse(500,error.message))

    }
}

const logoutController = async (req,res)=>{
    console.log(`logoutController called ⛱`);
    try {
        // console.log(req.cookies.jwt);
        // 1. cleare cookies : now user not able to refersh access token
        res.clearCookie('refreshToken',{
            httpOnly:true,
            secure:true
        })

        // 2. Also remove AT from local storage in frontEnd
        return res.send(successResponse(200,"Logout successfully 😎"))

    } catch (error) {

        return res.send(errorResponse(500,error.message))

    }
}


module.exports = {
    signupController,
    loginController,
    refreshAccessTokenController,
    logoutController
}