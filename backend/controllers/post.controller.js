import User from "../models/user.model.js";
import Post from "../models/post.model.js"
import {v2 as cloudinary} from "cloudinary";
export const createpost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id;

    // 1. Check user
    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Validate input
    if (!text && !img) {
      return res
        .status(400)
        .json({ message: "Text or image is required to create a post" });
    }

    // 3. Upload image to Cloudinary (if exists)
    let imageUrl = "";
    if (img) {
      const imgCloud = await cloudinary.uploader.upload(img);
      imageUrl = imgCloud.secure_url;
    }

    // 4. Create post
    const newPost = new Post({
      user: userId,
      text,
      img: imageUrl,
    });

    // 5. Save post
    const createdPost = await newPost.save();

    // 6. Send response
    return res.status(201).json(createdPost);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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

export const  likepost= async(req,res)=>{
    try{
		const {postid}=req.params;
		const userid=req.user._id;
		const post= await Post.findById(postid);
		if(!post){
			return res.status(404).json({meassage:"post is not found "});
		}
		const isliked= post.likes.includes(userid);
		if(isliked){
		const updatedvalue=	await Post.findByIdAndUpdate(postid,{$pull:{likes:userid}},{new:true});
		return res.status(201).json(updatedvalue)
		}
		if(!isliked){
		const updatedvalue=	await Post.findByIdAndUpdate(postid,{$push:{likes:userid}},{new:true});
		return res.status(201).json(updatedvalue)
		}
		await post.save();
		res.status(201).json({message:"liked added or removed succuessfully"});
	}catch(error){
       res.status(500).json({message:"internal error"})
	}
}

export const  commentpost=async(req,res)=>{
    try{
      const {postid}=req.params;
	  const {text}=req.body;
	  const userid=req.user._id;
	  const user=await User.findById(userid);
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
		user:userid
	   }

	   await post.comment.push(comment);
	   const commentvalue=await post.save();
        res.status(201).json(commentvalue.comment);
	 


	}catch(error){
       res.status(500).json({message:"internal server error"})
	}
}