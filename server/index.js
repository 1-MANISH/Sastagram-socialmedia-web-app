const express = require("express")
const dotenv = require("dotenv")
const cloudinary = require("cloudinary").v2
const cookieParser = require("cookie-parser")
const cors = require("cors")
const connectToDatabase = require("./dbConnect")


// import routers
const authRouter = require("./routers/authRouter")
const userRouter = require("./routers/userRouter")
const postRouter = require("./routers/postRouter")

//config
dotenv.config({path:'./.env'})
const app = express()
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

const PORT = process.env.PORT || 4000
const BASE_URL = process.env.BASE_URL || "http://localhost:"

// middlewares

app.set("view engine","ejs")
app.use(express.json({limit:"1000mb"}))
app.use(cookieParser())
app.use(express.static("public"))
app.use(cors({
    credentials:true,
    origin:process.env.FRONTEND_BASE_URL
}))



// routes
app.use('/auth',authRouter)
app.use("/api/user",userRouter)
app.use("/api/post/",postRouter)

// Connect to DB
connectToDatabase()


app.listen(PORT ,()=>{
    console.log(`Server is listening ✌ : ${BASE_URL}:${PORT}`);
})

//set CLOUDINARY_URL=cloudinary://775929786879246:QrFJsinWv1q5P2g3L5T9X0GBXqM@dfupoyysc