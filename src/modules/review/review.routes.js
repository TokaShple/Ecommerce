import { Router } from "express";
import * as reviewController from "./review.controllers.js";
import { protectRoutes } from "../auth/auth.controllers.js";

const reviewRouter=Router();

reviewRouter.route("/")
  .get(reviewController.getallReview)
  .post(reviewController.createReview);
reviewRouter.route("/:id")
  .get(reviewController.getReviewById)
  .put(protectRoutes,reviewController.updateReviewById)
  .delete(reviewController.deleteReviewById);

export default reviewRouter;