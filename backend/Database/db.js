import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectmongodb=async ()=>{
	try{
     const connectdb=  await  mongoose.connect(process.env.MONGODB_URI);
		console.log(`the connection is established${connectdb.connection.host}`);
	}catch(error){
		console.log("error happens in the connection to the database",error.message);
		process.exit(1);
}
}


export default connectmongodb;