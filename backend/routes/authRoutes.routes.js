
import express from "express";
import { LoginController, LogoutController, SingupController } from "../controllers/auth.controller.js";

const router=express.Router();

router.post("/signup",SingupController)

router.post("/login",LoginController)


router.post("/logout",LogoutController)


export default router;