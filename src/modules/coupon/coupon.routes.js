import { Router } from "express";
import * as couponController from "./coupon.controllers.js";
import { protectRoutes } from "../auth/auth.controllers.js";

const couponRouter=Router();

couponRouter.route("/")
  .get(protectRoutes,couponController.getallCoupon)
  .post(protectRoutes,couponController.createCoupon);
couponRouter.route("/:id")
  .get(protectRoutes,couponController.getCouponById)
  .put(protectRoutes,couponController.updateCouponById)
  .delete(protectRoutes,couponController.deleteCouponById);

export default couponRouter;