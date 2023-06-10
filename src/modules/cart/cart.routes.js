import { Router } from "express";
import * as cartController from "./cart.controller.js";
import { protectRoutes } from "../auth/auth.controllers.js";
const cartRouter=Router();
cartRouter.route("/")
.post(protectRoutes,cartController.createCart)
.get(protectRoutes,cartController.getCart)
.put(protectRoutes,cartController.updateCart)
cartRouter.route("/:id")
.delete(protectRoutes,cartController.deleteCartItem)
cartRouter.get("/getAllCarts",cartController.getCarts);
export default cartRouter;
