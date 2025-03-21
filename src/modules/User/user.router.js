import Router from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as userController from "./controller/user.controller.js";
import {
  changePasswordSchema,
  headersSchema,
  updateUserSchema,
  userIdSchema,
} from "./controller/user.validation.js";
import { allowedTypesMap, fileUpload } from "../../utils/multerCloudinary.js";

const router = Router();

//user profile
router.get(
  "/userProfile",
  isValid(headersSchema, true),
  auth(["admin","user"]),
  userController.userProfile
);

//user public profile
router.get(
  "/userPublicProfile/:userId",
  isValid(headersSchema, true),
  auth(["admin","user"]),
  isValid(userIdSchema),
  userController.userPublicProfile
);

//update user
router.post(
  "/updateUser",
  isValid(headersSchema, true),
  auth(["admin","user"]),
  isValid(updateUserSchema),
  userController.updateUser
);

//update password
router.patch(
  "/changePassword",
  isValid(headersSchema, true),
  auth(["admin","user"]),
  isValid(changePasswordSchema),
  userController.changePassword
);

//delete user
router.patch(
  "/deleteUser",
  isValid(headersSchema, true),
  auth(["admin","user"]),
  userController.deleteUser
);

//recover account
router.get("/accountRecovery/:reactiveToken", userController.accountRecovery);

//profile pic
router.patch(
  "/uploadProfilePic",
  isValid(headersSchema, true),
  auth(["admin","user"]),
  fileUpload(2,allowedTypesMap).single("profile"),
  userController.uploadProfilePic
);

//cover pic
router.patch(
  "/uploadCoverPic",
  isValid(headersSchema, true),
  auth(["admin","user"]),
  fileUpload(2,allowedTypesMap).single("cover"),
  userController.uploadCoverPic
);
export default router;
