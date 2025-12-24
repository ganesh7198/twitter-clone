import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js"; 
import {v2 as cloudinary} from "cloudinary";

export const createPost = async (req, res) => {
	try{
   const {img,text}=req.body;
   const id=req.user.id;
   if(!img || !text){
	   return res.status(400).json({message:"img and text is required"});
   }
   let cloudurl="";
   if(img){
	try{
	const cloudimg= await cloudinary.uploader.upload(img);
	   cloudurl= cloudimg.secure_url;
	}catch(error){
		return res.status(400).json({message:"error in uploading img "});
	}
   }
   const post=new Post({
	user:id,
	text:text,
	img:cloudurl,
	})
	  await  post.save();
	res.status(201).json({meassage:"post created sucessfully",data:post});
}catch(error){
	res.status(500).json({meassage:"internal server error"});
}

};


export const deletepost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ownership check
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    // delete image from cloudinary if exists
    if (post.img) {
      const imgid = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgid);
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const {id} = req.params;
    const userid = req.user._id;

    // Find the post by ID
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(id);

    if (isLiked) {
      // User has already liked the post, so we remove the like
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { $pull: { likes: userid } },
        { new: true }  // Return the updated post
      );

      // Optionally, delete the notification if exists
      await Notification.findOneAndDelete({
        from: userid,
        to: post.user,  // the user whose post was liked
        type: "like",
      });

      return res.status(200).json(updatedPost);  // Return the updated post with the new likes array
    } else {
      // User has not liked the post, so we add the like
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { $push: { likes: userid } },
        { new: true }  // Return the updated post
      );

      // Create a notification for the like action
      const notification = new Notification({
        from: userid,
        to: post.user,  // the user whose post was liked
        type: "like",
      });

      await notification.save();  // Save the notification

      return res.status(200).json(updatedPost);  // Return the updated post with the new likes array
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const  commentpost=async(req,res)=>{
    try{
      const {postid}=req.params;
	  const {text}=req.body;
	  const id=req.user._id;
	  const user=await User.findById(id);
	  if(!user){
		return res.status(404).json({message:"user is not found "});
	  }
	  if (!text || text.trim() === ""){
		return res.status(400).json({message:"please provide the text first"});
	  }
	  const post= await Post.findById(postid);
	  if(!post){
		return res.status(404).json({meassage:"post is not found"});
	  }
       const comment ={
		text,
		user:id
	   }

	   await post.comment.push(comment);
	   const commentvalue=await post.save();
        res.status(201).json(post);
	 


	}catch(error){
       res.status(500).json({message:"internal server error"})
	}
}

export const getAllPostsByUser = async (req, res) => {
  try {
    const { id } = req.params;  // Extract id from request params

    // Find all posts created by the specific user
    const posts = await Post.find({ user: id });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    // Send back the posts
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
