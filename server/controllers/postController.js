const cloudinary = require("cloudinary").v2
const Post = require("../models/Post");
const User = require("../models/User");
const ta = require("time-ago")
const { errorResponse, successResponse } = require("../utils/responseWrapper")


// ====> /api/post/getPostComment/id=hwud8w77ww
const getPostCommentController = async (req,res) => {
    console.log(`getPostCommentController called 😎`);
    try {
        
        // 1. Get post Id from URL
        const postId = req.params.id

        if(!postId){
            return res.send(errorResponse(400,"Post is not valid 🤢"))
        }

        // 2. find post
        const post = await Post.findById(postId).populate({
            path:"comment",
            populate:{path:"commentBy"}
        }).lean()

        post.comment = post.comment.map((cmnt)=>{
            cmnt.commentAgo = ta.ago(cmnt.commentedAt)
            return cmnt
        })

        post.comment.reverse()
        
        if(!post){
            return res.send(errorResponse(400,"Post not found 🤢"))
        }

        // ACK

        return res.send(successResponse(200,{comments:post.comment}))

    } catch (error) {

        return res.send(errorResponse(500,error.message))
    }
}

// ====> /api/post/likeOrUnlike/id=s87sfsufshf
const likeOrUnlikePostController = async (req,res) => {
    console.log(`likeOrUnlikePostController called 😎`);
    try {
        // 1. Current user id /  loggedIn user id
        const currentUserId = req._id

        const currentUser = await User.findById(currentUserId)
        if(!currentUser){
            return res.send(errorResponse(400,"Current user is not valid 😣"))
        }

        // 2. Now find id of the post to like
        const postId = req.params.id

        if(!postId){
            return res.send(errorResponse(400,"Post is not valid 🤢"))
        }

        // 3. find post
        const postToLike= await Post.findById(postId)
        
        if(!postToLike){
            return res.send(errorResponse(400,"Post not found 🤢"))
        }

        // Check for postLike status
        let isPostLiked = false
        let status = ""

        postToLike.likedBy.forEach((userId)=>{
            if(userId.equals(currentUserId)){
                isPostLiked=true
                return
            }
        })
        
       
        if(isPostLiked){  // 4.a Post is Already liked : Unlike IT

            // remove post_id from postLiked of user
            currentUser.postLiked = currentUser.postLiked.filter((postId)=>{
                return !postId.equals(postToLike._id)
            })
            // remove user_id from likedBy of post

            postToLike.likedBy = postToLike.likedBy.filter((userId)=>{
                return !userId.equals(currentUser._id)
            })

            status = "POST UNLIKED 👎"
           
        }
        else{             // 4.b Post to be liked : Like It

            // add post_id to postLiked of user
            currentUser.postLiked.push(postToLike._id)

            // add userId to likedBy of post
            postToLike.likedBy.push(currentUser._id)

            status="POST LIKED 💖"
        }


       // save both to DB
       await currentUser.save()
       await postToLike.save()

       return res.send(successResponse(200,{postLikeStatus:status}))


    } catch (error) {
        return res.send(errorResponse(500,error.message))
    }
}

// ====> /api/post/commentOnPost/id=s87sfsufshf
const commentOnPostController = async (req,res) =>{

    console.log(`commentOnPostController called 😎`);
    try {

        // 1. Get message
        const {message} = req.body
        
        if(!message){
            return res.send(errorResponse(400,"Provide required field 😣"))
        }
        // 2. Current user id /  loggedIn user id
        const currentUserId = req._id

        // 3. Now find id of the post for which we are writing comment
        const postId = req.params.id

        if(!postId){
            return res.send(errorResponse(400,"Post is not valid 🤢"))
        }

        // 4. find post
        const postToComment = await Post.findById(postId)
        
        if(!postToComment){
            return res.send(errorResponse(400,"Post not found 🤢"))
        }

        // 5. Add comment of current user to this post

        postToComment.comment.push({
            commentBy :currentUserId,
            message :message
        })

        await postToComment.save()

        return res.send(successResponse(200,"Message sent 🎇"))

    } catch (error) {
        return res.send(errorResponse(500,error.message))
    }
}

// ====> /api/post/createPost
const createPostController = async (req,res) => {

    console.log(`createPostController called 😎`);
    try {

        // 1. Get current user  & user id
        const currentUserId = req._id

        const currentUser = await User.findById(currentUserId)
        if(!currentUser){
            return res.send(errorResponse(400,"Current user is not valid 😣"))
        }

        // 2. Get all required field
        let {title,caption,mediaType,media} = req.body

        if(!title || !caption || !mediaType || !media){
            return res.send(errorResponse(400,"Provide required field 😣"))
        }

        // 3. upload this media image to cloudinary and get publicId URL
        console.log(mediaType);
        
        let cloudinaryResponse ;
        if(mediaType === "image" || mediaType === "video"){

            cloudinaryResponse = await cloudinary.uploader.upload_large(media, {
                folder: "UserPosts",
                resource_type: mediaType, // Explicitly specify the resource type for video
                tags: ["post", currentUser._id],
            });
        }
        else{
            return res.send(errorResponse(400,"Invalid media type 😣"))
        }
        

        // 4. create current user posts / make entry to DB

        const postCreated = await Post.create({
            title,
            caption,
            mediaType,
            media:{
                publicId:cloudinaryResponse.public_id,
                url:cloudinaryResponse.secure_url
            },
            createdBy:currentUserId
        })

        // 5. make entry of this post to current user schema
        currentUser.postCreated.push(postCreated._id)
        await currentUser.save()

        return res.send(successResponse(201,{postCreated}))
        
    } catch (error) {
        
        return res.send(errorResponse(500,error.message))
    }
}

// ====> /api/post/deletePost/id=s87sfsufshf
const deletePostController = async (req,res) => {
    console.log(`deletePostController called 😎`);
    try {

        // 1. Get current user  & user id
        const currentUserId = req._id

        const currentUser = await User.findById(currentUserId)
        if(!currentUser){
            return res.send(errorResponse(400,"Current user is not valid 😣"))
        }

        // 32 Now find id of the post which we want to delete
        const postId = req.params.id

        if(!postId){
            return res.send(errorResponse(400,"Post is not valid 🤢"))
        }

        // 4. find post
        const postToDelete = await Post.findById(postId)
        
        if(!postToDelete){
            return res.send(errorResponse(400,"Post not found 🤢"))
        }

        // 5.1 First Delele post from currentUser : [postCreated ]
        currentUser.postCreated  = currentUser.postCreated.filter((post)=>{
            return  !post.equals(postToDelete._id)
        })

        // 5.2 Remove it from all user postLiked array if liked by users
        const users = await User.find({})

        users.forEach(async(user)=>{
            user.postLiked = user.postLiked.filter((postId)=>{
                return !postId.equals(postToDelete._id)
            })
            await user.save()
        })

        // 5.3 Delete post from post DB
        const deletedPost = await Post.findByIdAndDelete(postToDelete._id)

        return res.send(successResponse(200,{deletedPost}))

        
    } catch (error) {
        return res.send(errorResponse(500,error.message))
    }
}

// ====> /api/post/editPost/id=s87sfsufshf
const updatePostController = async (req,res) => {

    console.log(`editPostController called 😎`);
    try {

        // 1. Get Required Field
        const {title,caption}  = req.body

        if(!title || !caption){
            return res.send(errorResponse(400,"Provide required field 😣"))
        }
        // 2. Get current user  & user id
        const currentUserId = req._id

        const currentUser = await User.findById(currentUserId)
        if(!currentUser){
            return res.send(errorResponse(400,"Current user is not valid 😣"))
        }

        // 3 Now find id of the post which we want to update
        const postId = req.params.id

        if(!postId){
            return res.send(errorResponse(400,"Post is not valid 🤢"))
        }

        // 4. find post
        const postToUpdate = await Post.findById(postId)
        
        if(!postToUpdate){
            return res.send(errorResponse(400,"Post not found 🤢"))
        }
        // 5. update Post

        postToUpdate.title = title
        postToUpdate.caption = caption

        const postUpdated = await postToUpdate.save()

        // ACK
        return res.send(successResponse(200,{postUpdated}))

    } catch (error) {

        return res.send(errorResponse(500,error.message))
    }
}

module.exports = {
    createPostController,
    commentOnPostController,
    likeOrUnlikePostController,
    deletePostController,
    updatePostController,
    getPostCommentController

}