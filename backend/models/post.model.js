
import mongoose, { mongo } from "mongoose";
const postScheam=mongoose.Schema({
    user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
		requried:true,
	},
	text:{
		type:String,
	},
	img:{
       type :String,
	},
	likes:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User",
	}],
	comment:[{
		text:{
			type:String,
			requried:true
		},
		user:{
			type :mongoose.Schema.Types.ObjectId,
		     ref:"User",
		   requried:true
		}
	}]
},{timestamps:true})

const Post=mongoose.model("Post",postScheam);
export default Post;