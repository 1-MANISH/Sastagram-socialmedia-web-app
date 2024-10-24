
const router = require("express").Router()
const requireUserMiddleware = require("../middlewares/requireUser")
const {getMyProfleController, getUserProfileController, updateUserProfileController, getMyPostController, getUserPostController, getFeedDataController, getFollowSuggestionController, sentFollowRequestController, acceptRequestController, rejectRequestController, sentfollowBackRequestController, unFollowUserController, deleteUserProfileController} = require("../controllers/userController")


router.delete("/deleteUserProfile",requireUserMiddleware,deleteUserProfileController) // deleteProfile



router.post("/sentfollowBackRequest/id=:id",requireUserMiddleware,sentfollowBackRequestController) // sentfollowBackRequest
router.post("/rejectRequest/id=:id",requireUserMiddleware,rejectRequestController) // rejectRequest
router.post("/acceptRequest/id=:id",requireUserMiddleware,acceptRequestController) // acceptRequest
router.post("/sentFollowRequest/id=:id",requireUserMiddleware,sentFollowRequestController) // sentFollowRequestController
router.post("/unFollowUser",requireUserMiddleware,unFollowUserController) // unFollowUser




router.post("/update",requireUserMiddleware,updateUserProfileController) // updateProfile

router.get("/getFollowSuggestion",requireUserMiddleware,getFollowSuggestionController) // getFollowSuggestion
router.get("/getFeedData",requireUserMiddleware,getFeedDataController) // getFeedData
router.get('/getUserPost/id=:id',requireUserMiddleware,getUserPostController)//getUserPost
router.get("/getMyPost",requireUserMiddleware,getMyPostController) // getMyPost
router.get("/id=:id",requireUserMiddleware,getUserProfileController) // getUserProfile
router.get("/myProfile",requireUserMiddleware,getMyProfleController) // getMyProfile


module.exports = router