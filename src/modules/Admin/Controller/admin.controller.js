import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

//All users
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const allUsers = await userModel.find();
  return res.status(200).json({
    status: "Success",
    message: "Done",
    AllUsers: allUsers.length,
    AllUsers: allUsers,
  });
});

//all online users
export const onlineUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel
    .find({ status: "online" })
    .select("firstName lastName email");
  return res.status(200).json({
    status: "Success",
    message: "Done",
    AllUsers: users.length,
    result: users,
  });
});

//block user
export const blockUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.params.userId);
  if (!user) {
    return next(new Error("User not found"), { cause: 404 });
  }
  if (user.isBlocked) {
    return next(new Error("User is already blocked"), { cause: 410 });
  }
  if (user.role == "admin") {
    return next(new Error("You can't blocked admin"), { cause: 403 });
  }
  user.isBlocked = true;
  await user.save();
  return res.status(200).json({
    status: "Success",
    message: "User blocked successfully",
    user: {
      _id: user._id,
      firstName: user._firstName,
      lastName: user._lastName,
      eamil: user.email,
      isBlocked: true,
    },
  });
});

//unblock user
export const unBlockUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await userModel.findByIdAndUpdate(
    { _id: userId },
    {
      isBlocked: false,
    }
  );
  if (!user) {
    return next(new Error("User not found"), { cause: 404 });
  }
  if (!user.isBlocked) {
    return next(new Error("User is already not blocked"), { cause: 410 });
  }
  return res.status(200).json({
    status: "Success",
    message: "User unblocked successfully",
    user: {
      _id: user._id,
      firstName: user._firstName,
      lastName: user._lastName,
      eamil: user.email,
      isBlocked: false,
    },
  });
});
