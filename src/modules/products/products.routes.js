import { Router } from "express";
import express from "express";
import * as productController from "./products.controllers.js"
import { validation } from "../../utlis/middleware/validation.js";
import { createProductSchema, deleteProductByIdSchema, getProductByIdSchema, updateProductByIdSchema } from "./products.validator.js";
import { allowTo, protectRoutes } from "../auth/auth.controllers.js";
import { uploadMixFiles } from "../../utlis/middleware/fileUploads.js";
const productRouter=Router();

productRouter.route("/")
  .get(productController.getallProducts)
  .post(uploadMixFiles('product',[{name:"imgCover",maxCount:1},{name:"images",maxCount:8}]),protectRoutes/*,allowTo("admin")*/,validation(createProductSchema),productController.createProduct);
productRouter.route("/:id")
  .get(validation(getProductByIdSchema),productController.getProductById)
  .put(protectRoutes,allowTo("admin"),validation(updateProductByIdSchema),productController.updateProductById)
  .delete(protectRoutes,allowTo("admin"),validation(deleteProductByIdSchema),productController.deleteProductById);

export default productRouter;
