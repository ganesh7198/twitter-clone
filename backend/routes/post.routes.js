import express from "express";
import { protectroute } from "../middleware/protectroute.middleware.js";
import { commentpost, createPost, deletepost, getAllPostsByUser, getfollowingpost, likedbyuser, likePost } from "../controllers/post.controller.js";

const router=express.Router();

router.post("/create-post",protectroute,createPost)
router.delete("/delete-post/:id",protectroute,deletepost)
router.post("/like-post/:id",protectroute,likePost)
router.get("/liked-post/:id",protectroute,likedbyuser)
router.post("/comment-post/:postid",protectroute,commentpost)
router.get("/get-all-post/:id",protectroute,getAllPostsByUser)
router.get("/get-following-post",protectroute,getfollowingpost);

export default router;