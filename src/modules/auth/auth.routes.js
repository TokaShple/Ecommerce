import express from "express";
import * as authController from "./auth.controllers.js";
const authRouter=express.Router();
authRouter.post("/signup",authController.signUp);
authRouter.post("/signin",authController.signIn);
authRouter.put("/logout",authController.logout);
export default authRouter;