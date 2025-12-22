import express from "express";
import { protectroute } from "../middleware/protectroute.middleware.js";
import { commentpost, createpost, deletepost, likepost } from "../controllers/post.controller.js";

const router=express.Router();

router.post("/create-post",protectroute,createpost)
router.delete("/delete-post/:id",protectroute,deletepost)
router.post("/like-post/:id",protectroute,likepost)
router.post("/comment-post/:id",protectroute,commentpost)

export default router;