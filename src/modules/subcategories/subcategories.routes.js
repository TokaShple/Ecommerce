import { Router } from "express";
import express from "express";
import * as subcategoryController from "./subcategories.controllers.js";
import { validation } from "../../utlis/middleware/validation.js";
import { createSubcategorySchema, deleteSubcategoryByIdSchema, getSubcategoryByIdSchema, updatesubcategoryByIdSchema } from "./subcategories.validator.js";
const subcategoryRouter=express.Router({mergeParams:true});

subcategoryRouter.route("/")
  .get(subcategoryController.getallSubCategory)
  .post(validation(createSubcategorySchema),subcategoryController.createSubCategory);
subcategoryRouter.route("/:id")
  .get(validation(getSubcategoryByIdSchema),subcategoryController.getSubCategoryById)
  .put(validation(updatesubcategoryByIdSchema),subcategoryController.updateSubCategoryById)
  .delete(validation(deleteSubcategoryByIdSchema),subcategoryController.deleteSubCategoryById);

export default subcategoryRouter;