import express from "express";
import * as adressController from "./address.controller.js";
import { protectRoutes } from "../auth/auth.controllers.js";
const addressRouter=express.Router();
addressRouter.patch("/addToAddress",protectRoutes,adressController.addToAddress);
addressRouter.delete("/removeFromAddress",protectRoutes,adressController.removeFromAddress);
addressRouter.get("/getAllAddress",protectRoutes,adressController.getAllAddress);
export default addressRouter;