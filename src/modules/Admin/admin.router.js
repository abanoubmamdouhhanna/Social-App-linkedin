import { Router } from "express";
import * as adminController from "./Controller/admin.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { headersSchema, userIdSchema } from "./Controller/admin.validation.js";
import { isValid } from "../../middlewares/validation.middleware.js";
const router = Router();

//All users
router.get("/allUsers", adminController.getAllUsers);

//all online users
router.get(
  "/onlineUsers",
  isValid(headersSchema, true),
  auth(["admin"]),
  adminController.onlineUsers
);

//block user
router.patch(
  "/blockuser/:userId",
  isValid(headersSchema, true),
  auth(["admin"]),
  isValid(userIdSchema),
  adminController.blockUser
);

//unblock user
router.patch(
  "/unblockuser/:userId",
  isValid(headersSchema, true),
  auth(["admin"]),
  isValid(userIdSchema),

  adminController.unBlockUser
);

export default router;
