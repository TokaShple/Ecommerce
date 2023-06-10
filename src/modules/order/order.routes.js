import { Router } from "express";
import * as orderConrtoller from "./order.controller.js";
import { protectRoutes } from "../auth/auth.controllers.js";
const orderRouter=Router();
orderRouter.route("/:id")
  .post(protectRoutes,orderConrtoller.createCacheOrder);
orderRouter.route("/checkout/:id")
  .post(protectRoutes,orderConrtoller.onlinePayment);
orderRouter.route("/")
  .get(protectRoutes,orderConrtoller.getOrder);
orderRouter.get("/getAllOrders",protectRoutes,orderConrtoller.getAllOrder);
export default orderRouter;