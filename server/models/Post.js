const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxlength:20
    },
    caption:{
        type:String,
        required:true,
        maxlength:100
    },
    mediaType:{
        type:String,
        enum:["video","image"],
        required:true
    },
    media:{
        publicId:String,
        url:String
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    likedBy:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User"
        }
    ],
    comment:[
        {
            commentBy:{
                type:mongoose.Types.ObjectId,
                ref:"User"
            },
            message:{
                type:String,
                maxlength:40
            },
            commentedAt:{
                type:Date,
                default:Date.now
            }
        }
    ]
},
{
    timestamps:true
}
)

const Post = mongoose.model("Post",PostSchema)

module.exports = Post