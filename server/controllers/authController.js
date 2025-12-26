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

        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!emailRegex.test(email)){
                return res.send(errorResponse(400,"Please enter valid email"))
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
                return res.send(errorResponse(403,"Wrong credentials 😂"))
        }

        // 3. Generate access token : save in cookies: from backend
        const accessToken = generateAccessToken({
                _id :user._id
        })
        // 4.  Generate refresh token : save to cookies : from BackEnd
        const refreshToken = generateRefreshToken({
                _id:user._id
        })

        const flag  = process.env.NODE_ENV

        res
        .cookie('accessToken',accessToken,{
                maxAge:1000*60*60*24,
                httpOnly:flag === "production",
                secure:true,
                sameSite:flag === "production" ? "none" : "lax"
        })
        .cookie('refreshToken',refreshToken,{
                maxAge:1000*60*60*24*7,
                httpOnly:flag === "production",
                secure:true,
                sameSite:flag === "production" ? "none" : "lax"
        })

        // ACK
        return res.send(successResponse(200,{user:{
                name:user.name,
                email:user.email,
                avatar:user.avatar,
                _id:user._id
        }}))

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

        res.cookie(
                'accessToken'
                ,newAccessToken,
                {
                        maxAge:1000*60*60*24,
                        httpOnly:true,
                        secure:true,
                        sameSite:"none"
                }
        )

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

        // 1. cleare cookies : now user not able to refersh access token
        res.cookie(
                'refreshToken'
                ,null,{
                        maxAge:0,
                        httpOnly:true,
                        secure:true,
                        sameSite:"none"
                })
                .cookie(
                'accessToken'
                ,null,
                {
                        maxAge:0,
                        httpOnly:true,
                        secure:true,
                        sameSite:"none"
                }
        )

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