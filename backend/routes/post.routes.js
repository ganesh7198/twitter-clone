import express from "express";
import { protectroute } from "../middleware/protectroute.middleware.js";
import { commentpost, createPost, deletepost, getAllPostsByUser, likePost } from "../controllers/post.controller.js";

const router=express.Router();

router.post("/create-post",protectroute,createPost)
router.delete("/delete-post/:id",protectroute,deletepost)
router.post("/like-post/:id",protectroute,likePost)
router.post("/comment-post/:postid",protectroute,commentpost)
router.get("/get-all-post/:id",protectroute,getAllPostsByUser)

export default router;