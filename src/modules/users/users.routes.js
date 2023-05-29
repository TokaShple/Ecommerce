import { Router } from "express";
import * as userController from "./users.controllers.js";
const userRouter=Router();

userRouter.route("/")
  .get(userController.getallUsers)
  .post(userController.createUser);
userRouter.route("/:id")
  .get(userController.getUserById)
  .put(userController.updateUserById)
  .delete(userController.deleteUserById)
  .patch(userController.changePassword);

export default userRouter;