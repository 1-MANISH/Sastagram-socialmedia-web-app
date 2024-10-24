const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    followings:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User"
        }
    ],
    followers:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User"
        }
    ],
    followRequest:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User"
        }
    ],
    followingRequest:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User"
        }
    ],
    postCreated:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Post"
        }
    ],
    postLiked:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Post"
        }
    ],
    bio:{
        type:String,
        maxlength:20
    },
    avatar:{
        publicId:String,
        url:String
    }
},
{
    timestamps:true
})

const User = mongoose.model("User",userSchema)

module.exports = User