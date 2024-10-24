const cloudinary = require("cloudinary").v2
const Post = require("../models/Post");
const User = require("../models/User");
const ta = require("time-ago")
const { successResponse, errorResponse } = require("../utils/responseWrapper");


// =====> /api/deleteProfile
const deleteUserProfileController = async (req,res) => {
    console.log(`deleteUserProfileController called 😎`);

    try {
        
        // 1. Get current user_id + user
        const currentUserId = req._id
        const currentUser = await User.findById(currentUserId)
        const allUser = await User.find({_id:{$ne:currentUser._id}}) // other than current user

        if(!currentUser){
            return res.send(errorResponse(404,"User Not Found . May be deleted Already 😂"))
        }

        //2

        const allPost = await Post.find({createdBy:{$ne:currentUser._id}}) // Other than current user post
        const allPostOfCurrentUser = await Post.find({createdBy:{$eq:currentUser._id}})

        
        // 2.1 Delete all post of current user
        await Post.deleteMany({createdBy:{$eq:currentUser._id}})

        // 2.2 which ever post liked by current user & comment to that post  go to those post and remove if from likedBy array of that post & comment array

        allPost.forEach(async(post)=>{

            post.likedBy = post.likedBy.filter((userId)=>{
                return !userId.equals(currentUser._id)
            })
            post.comment = post.comment.filter((commentObj)=>{
                return !commentObj.commentBy.equals(currentUser._id)
            })

            await post.save()
        })

        // 2.3 Delete user related parameters
        allUser.forEach(async(user)=>{
             
            user.followers = user.followers.filter((userId)=>{
                return !userId.equals(currentUser._id)
            })

            user.followings = user.followings.filter((userId)=>{
                return !userId.equals(currentUser._id)
            })

            user.followRequest = user.followRequest.filter((userId)=>{
                return !userId.equals(currentUser._id)
            })
            user.followingRequest = user.followingRequest.filter((userId)=>{
                return !userId.equals(currentUser._id)
            })

            allPostOfCurrentUser.forEach(async(currentUserPost)=>{
                user.postLiked = user.postLiked.filter(async(postId)=>{
                    return !postId.equals(currentUserPost._id)
                })
            })
            
            await user.save()
        })

        // Delete user
        await User.deleteOne({_id:currentUser._id})


        return res.send(successResponse(200,"User Profile Deleted Successfull ⛳"))
        

    } catch (error) {
        return res.send(errorResponse(500,error.message))
    }
}

// =====> /api/followbackRequest/id=shfuf78f7
const sentfollowBackRequestController = async(req,res)=>{
    console.log(`sentfollowBackRequestController called 😎`);
    try {
          // 1. Get current user_id + user
          const currentUserId = req._id

          const currentUser = await User.findById(currentUserId)
  
          if(!currentUser){
              return res.send(errorResponse(404,"User Not Found 😂"))
          }

          // 2. Get user_id to followback and userToFollowBack
          const userIdToFollowBack = req.params.id
          if(!userIdToFollowBack){
            return res.send(errorResponse(404,"UserId To FollowBack is not valid 🤣"))
          }
          
          const userToFollowBack = await User.findById(userIdToFollowBack)

          if(!userToFollowBack){
            return res.send(errorResponse(404,"User To FollowBack is not found 🤣"))
          }

          // 3

          // 3.1 Remove that user_id from current user followRequest
          currentUser.followRequest = currentUser.followRequest.filter((userId)=>{
            return !userId.equals(userToFollowBack._id)
          })

          // 3.2 Add that user_id to current user follower list
          if(!currentUser.followers.includes(userToFollowBack._id)){
             currentUser.followers.push(userToFollowBack._id)
          }
              

          // 3.3 Add that user to current user followingRequest : followBack
          if(!currentUser.followingRequest.includes(userToFollowBack._id)){
            currentUser.followingRequest.push(userToFollowBack._id)
          }
          

          // 3.4 Remove current_user_id from that user followingRequest
          userToFollowBack.followingRequest = userToFollowBack.followingRequest.filter((userId)=>{
            return !userId.equals(currentUser._id)
          })

          // 3.5 Add current_user_id to followings of that user
          if(!userToFollowBack.followings.includes(currentUser._id)){
              userToFollowBack.followings.push(currentUser._id)
          }
         

          // 3.6 Also add current_user_id to followingsRequest of that user : to followBack
          if(!userToFollowBack.followRequest.includes(currentUser._id)){
            userToFollowBack.followRequest.push(currentUser._id)
          }
          
          
          await currentUser.save()
          await userToFollowBack.save()

          return res.send(successResponse(200,"FollowBack Request Sent 🎆"))

    } catch (error) {
        return res.send(errorResponse(500,error.message))
    }
}

// =====> /api/rejectRequest/id=sfhiuf78f78s
const rejectRequestController = async (req,res) => {
    console.log(`rejectRequestController called 😎`);
    try {

         // 1. Get current user_id + user
         const currentUserId = req._id

         const currentUser = await User.findById(currentUserId)
 
         if(!currentUser){
             return res.send(errorResponse(404,"User Not Found 😂"))
         }
 
         // 2. userIdToAcceptRequest
         const userIdToRejectFollowRequest = req.params.id
         if(!userIdToRejectFollowRequest){
             return res.send(errorResponse(404,"UserId to reject follow request is not valid 😂"))
         }
 
         const userToRejectFollowRequest = await User.findById(userIdToRejectFollowRequest)
 
         if(!userToRejectFollowRequest){
             return res.send(errorResponse(404,"User to reject follow request is not valid 😂"))
         }
 
         // 3. 
         // 3.1 Remove that user_id from current user followRequest
         currentUser.followRequest = currentUser.followRequest.filter((userId)=>{
            return !userId.equals(userToRejectFollowRequest._id)
         })

         // 3.2 Remove current user_id from followingRequest of that user
         userToRejectFollowRequest.followingRequest = userToRejectFollowRequest.followingRequest.filter((userId)=>{
            return !userId.equals(currentUser._id)
         })
         
         await currentUser.save()
         await userToRejectFollowRequest.save()

         return res.send(successResponse(200,{requestStatus:"Request Rejected 💣"}))
        
    } catch (error) {
        return res.send(errorResponse(500,error.message))
    }
}

// =====> /api/acceptRequest/id=sfhiuf78f78s
const acceptRequestController = async (req,res) => {
    console.log(`acceptRequestController called 😎`);
    try {

        // 1. Get current user_id + user
        const currentUserId = req._id

        const currentUser = await User.findById(currentUserId)

        if(!currentUser){
            return res.send(errorResponse(404,"User Not Found 😂"))
        }

        // 2. userIdToAcceptRequest
        const userIdToAcceptFollowRequest = req.params.id
        if(!userIdToAcceptFollowRequest){
            return res.send(errorResponse(404,"UserId to accept follow request is not valid 😂"))
        }

        const userToAcceptFollowRequest = await User.findById(userIdToAcceptFollowRequest)

        if(!userToAcceptFollowRequest){
            return res.send(errorResponse(404,"User to accept follow request is not valid 😂"))
        }

        // 3. 

        // 3.1 Remove that user_id it from current user follow request
        currentUser.followRequest = currentUser.followRequest.filter((userId)=>{
            return !userId.equals(userToAcceptFollowRequest._id)
        })

        // 3.2 Add that user_id to follower list
        if(!currentUser.followers.includes(userToAcceptFollowRequest._id)){
            currentUser.followers.push(userToAcceptFollowRequest._id)
        }
        

        // 3.3 Remove currentUser_id from followingRequest of that user
        userToAcceptFollowRequest.followingRequest = userToAcceptFollowRequest.followingRequest.filter((userId)=>{
            !userId.equals(currentUser._id)
        })

        // 3.4  Add currentUser_id to following list of that user
        if(!userToAcceptFollowRequest.followings.includes(currentUser._id)){
            userToAcceptFollowRequest.followings.push(currentUser._id)
        }
        
        await currentUser.save()
        await userToAcceptFollowRequest.save()

        //ACK
        return res.send(successResponse(200,{requestStatus:"Request Accepted 🎉"}))
        
    } catch (error) {
        return res.send(errorResponse(500,error.message))
    }
}

// =====> /api/sentFollowRequest/id=sdks7d7s9dsd
const sentFollowRequestController = async (req,res)=>{
    console.log(`sentFollowRequestController called 😎`);
    try {

        // 1. Get current/ logged In user_id + user
        const currentUserId = req._id

        const currentUser = await User.findById(currentUserId)

        if(!currentUser){
            return res.send(errorResponse(404,"User Not Found 😂"))
        }

        // 2. get userId to sent follow request
        const userIdToSentFollowRequest = req.params.id

        if(!userIdToSentFollowRequest){
            return res.send(errorResponse(404,"UserId to sent follow request is not valid 😂"))
        }

        const userToSentFollowRequest = await User.findById(userIdToSentFollowRequest)

        if(!userToSentFollowRequest){
            return res.send(errorResponse(404,"User to sent follow request is not found 😂"))
        }
        // 3. Checks
        let alreadySentRequest = false
        let requestStatus = ""

        currentUser.followingRequest.forEach((userId)=>{
            if(userId.equals(userToSentFollowRequest._id)){
                alreadySentRequest = true
                return
            }
        })

       
        if(alreadySentRequest){              // 3.1  Already sent request

            requestStatus = "Request Already sent ✨"
            
        }else{                               // 3.2  Send request

            currentUser.followingRequest.push(userToSentFollowRequest._id)
            userToSentFollowRequest.followRequest.push(currentUser._id)

            requestStatus = "Request sent"
        }

        await currentUser.save()
        await userToSentFollowRequest.save()

        return res.send(successResponse(200,{requestStatus}))

        
    } catch (error) {
        return res.send(errorResponse(500,error.message))
    }
}

// =====> /api/user/unFollowUser/id=fhef878398r93
const unFollowUserController = async (req,res) => {
    console.log(`followOrUnFollowUserController called 😎`);
    try {

        // 1. Get current/ logged In user_id + user
        const currentUserId = req._id

        const currentUser = await User.findById(currentUserId)

        if(!currentUser){
            return res.send(errorResponse(404,"User Not Found 😂"))
        }

        // 2. get userId to follow or unfollow
        const userIdToUnFollow = req.params.id

        if(!userIdToUnFollow){
            return res.send(errorResponse(404,"UserId to follow is not valid 😂"))
        }

        const userToUnFollow = await User.findById(userIdToUnFollow)
        
        // 3. Assuming both user follow each other

        currentUser.followers = currentUser.followers.filter((userId)=>{
            return !userId.equals(userToUnFollow._id)
        })

        currentUser.followings = currentUser.followings.filter((userId)=>{
            return !userId.equals(userToUnFollow._id)
        })

        userToUnFollow.followers = userToUnFollow.followers.filter((userId)=>{
            return !userId.equals(currentUser._id)
        })

        userToUnFollow.followings = userToUnFollow.followings.filter((userId)=>{
            return !userId.equals(currentUser._id)
        })

        await currentUser.save()
        await userToUnFollow.save()

        return res.send(successResponse(200,"Unfollow the user 🎭"))
        
    } catch (error) {
        return res.send(errorResponse(500,error.message))
    }
}

// =====> /api/user/followRecommendation
const getFollowSuggestionController = async (req,res) => {

    console.log(`getFollowSuggestionController called 😎`);
    try {

        // 1. First get current user_id + user
        const currentUserId = req._id

        const currentUser = await User.findById(currentUserId)

        if(!currentUser){
            return res.send(errorResponse(404,"User Not Found 😂"))
        }

        // 2. Find all user , who are not in following list of current user

        const users = await User.find({_id:{$ne:currentUserId}}).populate("followers")

        const followSuggestions = []

        users.forEach(async(user)=>{
            flag = true
            user.followers.forEach((userId)=>{
                if(userId.equals(currentUserId)){
                    flag = false
                    return
                }
            })
            user.followRequest.forEach((userId)=>{
                if(userId.equals(currentUserId)){
                    flag=false
                    return
                }
            })

            user.followingRequest.forEach((userId)=>{
                if(userId.equals(currentUserId)){
                    flag=false
                    return
                }
            })
            if(flag)
              followSuggestions.push(user)
        })

        // ACK
        return res.send(successResponse(200,{followSuggestions}))

    } catch (error) {

        return res.send(errorResponse(500,error.message))
    }
}

// =====> /api/user/feedData
const getFeedDataController = async (req,res)=>{

    console.log(`getFeedDataController called 😎`);
    try {
        // 1. get current user id
        const currentUserId = req._id

        // 2. find all user posts other than current user
        const allPosts = await Post.find({createdBy:{$ne:currentUserId}}).populate("createdBy").lean()

        allPosts?.map((post)=>{
            let flag = false
            post.likedBy?.forEach((userId)=>{
                if(userId.equals(currentUserId)){
                    post.isLiked=true
                    flag=true
                    return
                }
            })
            if(!flag)
                post.isLiked=false
            post.createdAgo = ta.ago(post.createdAt)
            return post
        })

        allPosts.reverse()

        return res.send(successResponse(200,{allPosts}))

    } catch (error) {
        
        return res.send(errorResponse(500,error.message))
    }

}

// =====> /api/user/getUserPost/id=dhjs787f8s
const getUserPostController = async(req,res)=>{
    console.log(`getUserPostController called 😎`);

    try {
        
        // 1. Get id of user from url : /api/user/id=1dhjsd87871
        const userId = req.params.id
        if(!userId){
            return res.send(errorResponse(400,"UserId is not valid 🤢"))
        }

        // 2. Find user
        const user = await User.findById(userId)

        if(!user){
            return res.send(errorResponse(404,"User not found 😅"))
        }

        // 3. Now find this user posts
        const posts = await Post.find({createdBy:userId}).populate("postCreated")
        
        // ACK

        return res.send(successResponse(200,{posts}))

    } catch (error) {
        
        return res.send(errorResponse(500,error.message))
    }
}

// =====> /api/user/getMyPost
const getMyPostController = async (req,res)=>{

    console.log(`getMyPostController called 😎`);

    try {
        // 1. Get user id
        const currentUserId = req._id

        // 2. Find user
        const user = await User.findById(currentUserId)

        // 3. Find current user posts from post DB

        const posts = await Post.find({createdBy:currentUserId})

        // ACK
        return res.send(successResponse(200,{posts}))
        
    } catch (error) {
        return res.send(errorResponse(500,error.message))
    }
}

// =====> /api/user/update
const updateUserProfileController = async(req,res)=>{

    console.log(`updateUserProfileController called 😎`);
    try {
        
        // 1. Exract field
        const {name,bio,avatarImage} = req.body

        if(!name || !bio){
            return res.send(errorResponse(400,"Provide required field 😣"))
        }

        // 2. Get current user _id
        const currentUserId = req._id

        if(!currentUserId){
            return res.send(errorResponse(400,"UserId is not valid 😣"))
        }

        // 3. Get current user 
        const currentUser = await User.findById(currentUserId)

        if(!currentUser){
            return res.send(errorResponse(404,"User not found 😣")) 
        }

        // 4. update user
        currentUser.name = name
        currentUser.bio = bio

        if(avatarImage){

            // upload avatar image to cloudinary
            const cloudinaryResponse = await cloudinary.uploader.upload(
                avatarImage,
                {
                    folder:"UserAvatarImages",
                    tags:["avatar",currentUser._id]
                }
            )

            // update user avatar details
            currentUser.avatar.publicId = cloudinaryResponse.public_id
            currentUser.avatar.url = cloudinaryResponse.secure_url
        }

        const updatedUser = await currentUser.save()

        // ACK
        return res.send(successResponse(200,{updatedUser}))
        
    } catch (error) {
        return res.send(errorResponse(500,error.message))
    }
}

// =====> /api/user/id=2u3uy232uhuhu
const getUserProfileController = async(req,res)=>{
    console.log(`getUserProfileController called 😎`);
    try {
        
        // 1. Get id of user from url : /api/user/id=1dhjsd87871
        const userId = req.params.id
        if(!userId){
            return res.send(errorResponse(400,"UserId is not valid 🤢"))
        }

        // 2. Find user
        const user = await User.findById(userId).populate({
            path: 'postCreated', // Populate the 'postCreated' field
            populate: {
              path: 'createdBy', // Within each post, populate the 'createdBy' field
            }
        }).lean();

        // mapping to manage likes
        user?.postCreated?.map((post)=>{
            if(post.likedBy?.includes(userId) > 0){
                post.isLiked=true
            }else{
                post.isLiked=false
            }
            post.createdAgo = ta.ago(post.createdAt)
            return post
        })
        user.postCreated.reverse()

        if(!user){
            return res.send(errorResponse(404,"User not found 😅"))
        }

        // ACK
        return res.send(successResponse(200,{user}))

    } catch (error) {

        res.send(errorResponse(500,error.message))

    }
}

// =====> /api/user/myProfile
const getMyProfleController = async(req,res)=>{

    console.log(`getMyProfleController called 😎`);

    try {

        // 1. Get current user _id
        const currentUserId = req._id
        
        // 2. Find user
        const user = await User.findById(currentUserId).populate("followRequest").populate("followingRequest").populate("followers").populate("followings").lean()

        // ACK
        return res.send(successResponse(200,{user}))
        
    } catch (error) {

        return res.send(errorResponse(500,error.message))
        
    }

}


module.exports = {
    getMyProfleController,
    getUserProfileController,
    updateUserProfileController,
    getMyPostController,
    getUserPostController,
    getFeedDataController,
    getFollowSuggestionController,
    unFollowUserController,
    sentFollowRequestController,
    acceptRequestController,
    rejectRequestController,
    sentfollowBackRequestController,
    deleteUserProfileController
}