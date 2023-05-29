import { Router } from "express";
import * as categoryController from "./categories.controllers.js";
import subcategoryRouter from "../subcategories/subcategories.routes.js";
import { validation } from "../../utlis/middleware/validation.js";
import { createCategorySchema, deleteCategoryByIdSchema, getCategoryByIdSchema, updateCategoryByIdSchema } from "./categories.validator.js";
import { uploadSingleFile } from "../../utlis/middleware/fileUploads.js";
const categoryRouter=Router();
categoryRouter.use('/:id/subcategory',subcategoryRouter);
categoryRouter.route("/")
  .get(categoryController.getallCategory)
  .post(uploadSingleFile('category','image'),validation(createCategorySchema),categoryController.createCategory);
categoryRouter.route("/:id")
  .get(validation(getCategoryByIdSchema),categoryController.getCategoryById)
  .put(validation(updateCategoryByIdSchema),categoryController.updateCategoryById)
  .delete(validation(deleteCategoryByIdSchema),categoryController.deleteCategoryById);

export default categoryRouter;