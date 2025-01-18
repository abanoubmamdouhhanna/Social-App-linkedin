import { Router } from "express";
import * as adminController from "./Controller/admin.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
const router = Router();

//All users
router.get("/allUsers", adminController.getAllUsers);

//all online users
router.get("/onlineUsers", auth(["admin"]), adminController.onlineUsers);

//block user
router.patch("/blockuser/:userId", auth(["admin"]), adminController.blockUser);

//unblock user
router.patch(
  "/unblockuser/:userId",
  auth(["admin"]),
  adminController.unBlockUser
);

export default router;
