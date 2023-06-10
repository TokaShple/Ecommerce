import AppError from "../utlis/services/AppError.js";
import categoryRouter from "./categories/categories.routes.js";
import subcategoryRouter from "./subcategories/subcategories.routes.js";
import brandRouter from "./brands/brands.routes.js";
import productRouter from "./products/products.routes.js";
import userRouter from "./users/users.routes.js";
import authRouter from "./auth/auth.routes.js";
import reviewRouter from "./review/review.routes.js";
import globalError from "../utlis/middleware/globalErrorHandle.js";
import wishListRouter from "./wishList/wishList.routes.js";
import addressRouter from "./address/adddress.routes.js";
import couponRouter from "./coupon/coupon.routes.js";
import cartRouter from "./cart/cart.routes.js";
import express from "express";
import orderRouter from "./order/order.routes.js";
export function init(app){
  app.use("/api/v1/categories",categoryRouter);
  app.use("/api/v1/subcategories",subcategoryRouter);
  app.use("/api/v1/brands",brandRouter);
  app.use("/api/v1/products",productRouter);
  app.use("/api/v1/users",userRouter);
  app.use("/api/v1/auth",authRouter);
  app.use("/api/v1/review",reviewRouter);
  app.use("/api/v1/wishList",wishListRouter);
  app.use("/api/v1/address",addressRouter);
  app.use("/api/v1/coupon",couponRouter);
  app.use("/api/v1/cart",cartRouter);
  app.use("/api/v1/order",orderRouter);
  app.get('/favicon.ico', (req,res) => res.status(204));
  app.use(express.static('uploads'));
  app.all('*',(req,res,next)=>{
      next (new AppError(`Can't find this route: ${req.originalUrl}`,404));
  })
  app.use(globalError);
}
