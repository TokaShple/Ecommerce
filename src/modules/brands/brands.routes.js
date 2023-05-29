import { Router } from "express";
import * as brandController from "./brands.controller.js";
import { validation } from "../../utlis/middleware/validation.js";
import { createBrandSchema, deleteBrandByIdSchema, getBrandByIdSchema, updateBrandByIdSchema } from "./brands.validator.js";
import { uploadSingleFile } from "../../utlis/middleware/fileUploads.js";
const brandRouter=Router();

brandRouter.route("/")
  .get(brandController.getallBrand)
  .post(uploadSingleFile('brand','logo'),validation(createBrandSchema),brandController.createBrand);
brandRouter.route("/:id")
  .get(validation(getBrandByIdSchema),brandController.getBrandById)
  .put(validation(updateBrandByIdSchema),brandController.updateBrandById)
  .delete(validation(deleteBrandByIdSchema),brandController.deleteBrandById);

export default brandRouter;