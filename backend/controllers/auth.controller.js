export const LoginController= async (req,res)=>{
   res.json({
	 message:"you hit the login page"
   })
}

export const LogoutController= async(req,res)=>{
   res.json({
	 message:"you hit the logout page"
   })
}

export const SingupController= async(req,res)=>{
   res.json({
	 message:"you hit the signup page"
   })
}
