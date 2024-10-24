
const router = require("express").Router()
const { createPostController, commentOnPostController, likeOrUnlikePostController, deletePostController, updatePostController, getPostCommentController } = require("../controllers/postController")
const requireUserMiddleware = require("../middlewares/requireUser")

router.get("/getPostComment/id=:id",requireUserMiddleware,getPostCommentController) // getPostComment
router.put("/updatePost/id=:id",requireUserMiddleware,updatePostController) // updatePost
router.delete("/deletePost/id=:id",requireUserMiddleware,deletePostController) // deletePost
router.post("/likeOrUnlikePost/id=:id",requireUserMiddleware,likeOrUnlikePostController) // likeOrUnlikePost
router.post("/createPost",requireUserMiddleware,createPostController) // createPost
router.post("/commentOnPost/id=:id",requireUserMiddleware,commentOnPostController) // commentOnPost

module.exports = router