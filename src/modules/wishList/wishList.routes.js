import express from "express";
import * as wishListController from "./wishList.controller.js";
import { protectRoutes } from "../auth/auth.controllers.js";
const wishListRouter=express.Router();
wishListRouter.patch("/addToWishList",protectRoutes,wishListController.addToWishList);
wishListRouter.delete("/removeFromWishList",protectRoutes,wishListController.removeFromWishList);
wishListRouter.get("/getAllWishList",protectRoutes,wishListController.getAllWishList);
export default wishListRouter;