import moment from "moment/moment.js";
import userModel from "../../../../DB/models/User.model.js";
import sendEmail from "../../../utils/Emails/sendEmail.js";
import { accountRecoveryEmail } from "../../../utils/Emails/accountRecoveryEmail.js";
import { uploadToCloudinary } from "../../../utils/cloudinaryHelpers.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { compare, Hash } from "../../../utils/Hash&Compare.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/generateAndVerifyToken.js";
//user profile
export const userProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findOne({ _id: req.user._id })
    .select(
      "userName firstName lastName email age phone availability gender headline DOB gender profileURL coverURL follow.accepted"
    );
  if (!user) {
    new Error("User not found", { cause: 404 });
  }
  return res.status(200).json({
    status: "Success",
    message: "User profile retrieved successfully",
    user,
  });
});
//====================================================================================================================//
//user public profile
export const userPublicProfile = asyncHandler(async (req, res, next) => {
  const selectItems =
    "userName firstName lastName email age phone availability gender headline DOB profileURL coverURL follow.accepted follow.requested";

  const user = await userModel
    .findById(req.params.userId)
    .populate([
      {
        path: "follow.accepted",
        select: selectItems,
        options: { sort: { firstName: 1 } },
      },
      {
        path: "follow.requested",
        select: "userName firstName lastName profileURL",
      },
    ])
    .select(selectItems)
    .lean();

  if (!user) {
    new Error("User not found", { cause: 404 });
  }

  // Add security measures - remove sensitive data if needed
  if (
    user.email &&
    !req.user?.role != "admin" &&
    req.user?._id.toString() !== req.params.userId
  ) {
    user.email = undefined; // Hide email from non-owners/non-admins
    user.phone = undefined; // Hide phone from non-owners/non-admins
  }

  // Add metadata to response
  return res.status(200).json({
    status: "Success",
    message: "User profile retrieved successfully",
    user,
    meta: {
      connectionCount: user.follow?.accepted?.length || 0,
      profileComplete: Boolean(
        user.firstName && user.lastName && user.profileURL
      ),
    },
  });
});

//====================================================================================================================//
//update user
export const updateUser = asyncHandler(async (req, res, next) => {
  const { userName, firstName, lastName, email, phone, gender, age, DOB } =
    req.body;
  if (
    !(
      userName ||
      firstName ||
      lastName ||
      email ||
      phone ||
      gender ||
      age ||
      DOB
    )
  ) {
    return next(
      new Error("Please provide at least one field to update", { cause: 400 })
    );
  }

  const checkUser = await userModel.findById({ _id: req.user._id });
  if (!checkUser) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const object = { ...req.body };

  for (let key in object) {
    if (checkUser[key] == object[key]) {
      return next(
        new Error(
          `Cannot update ${key} with the same value. Please provide a different value.`,
          { cause: 400 }
        )
      );
    }
  }

  if (userName || email) {
    const query = [];
    if (userName) query.push({ userName });
    if (email) query.push({ email });

    if (query.length) {
      const existingUser = await userModel.findOne({
        $or: query,
        _id: { $ne: req.user._id }, // Exclude current user from check
      });

      if (existingUser) {
        if (userName && existingUser.userName === userName) {
          return next(
            new Error("The username is already taken.", { cause: 409 })
          );
        }
        if (email && existingUser.email === email) {
          return next(
            new Error("The email is already in use.", { cause: 409 })
          );
        }
      }
    }
  }

  if (checkUser.isDeleted) {
    return next(
      new Error(
        "Can't update your information because your account may be suspended or deleted",
        { cause: 400 }
      )
    );
  }
  const updatedUser = await userModel.findByIdAndUpdate(
    { _id: req.user._id },

    req.body,
    { new: true }
  );
  return res.status(200).json({
    status: "Success",
    message: "User profile updated successfully",
    user: updatedUser,
  });
});

//====================================================================================================================//
//update password
export const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (oldPassword || newPassword) {
    return next(
      new Error("Old password and new password are required", { cause: 400 })
    );
  }
  const matchOld = compare({
    plainText: oldPassword,
    hashValue: req.user.password,
  });
  if (!matchOld) {
    return next(new Error("In-valid password", { cause: 409 }));
  }
  const checkMatchNew = compare({
    plainText: newPassword,
    hashValue: req.user.password,
  });
  if (checkMatchNew) {
    return next(
      new Error("New password can't be old password", { cause: 400 })
    );
  }
  const hashPassword = Hash({ plainText: newPassword });
  const user = await userModel
    .findByIdAndUpdate(
      req.user._id,
      { password: hashPassword, changeAccountInfo: new Date() },
      { new: true }
    )
    .select("userName email updatedAt");
  return res.status(200).json({
    status: "success",
    message: "Password updated successfully",
    result: user,
  });
});

//====================================================================================================================//
//deleteUser

export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  if (user.isDeleted) {
    return next(
      new Error("User account is already deactivated", { cause: 400 })
    );
  }

  const deactivationDate = moment().add(1, "month").toISOString(); // 30 days from now
  await userModel.findByIdAndUpdate(req.user._id, {
    isDeleted: true,
    status: "Not Active",
    permanentlyDeleted: deactivationDate,
  });

  const reactiveToken = generateToken({
    payload: { email: user.email, userId: user._id },
    signature: process.env.RECOVER_ACCOUNT_SIGNATURE,
    expiresIn: "30d",
  });

  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const recoveryLink = `${baseUrl}/user/accountRecovery/${reactiveToken}`;

  const html = accountRecoveryEmail(recoveryLink);
  const emailSent = await sendEmail({
    to: user.email,
    subject: "Account Recovery - Action Required",
    html,
  });

  if (!emailSent) {
    await userModel.findByIdAndUpdate(req.user._id, {
      isDeleted: false,
      status: "Active",
      $unset: { permanentlyDeleted: 1 },
    });

    return next(
      new Error(
        "Failed to send recovery email. Account deactivation canceled.",
        { cause: 500 }
      )
    );
  }
  return res.status(200).json({
    status: "success",
    message:
      "Your account has been deactivated. Check your email for recovery instructions. You have 30 days to recover your account before it's permanently deleted.",
    deactivatedUntil: deactivationDate,
  });
});

//====================================================================================================================//
//recover account
export const accountRecovery = asyncHandler(async (req, res, next) => {
  const { reactiveToken } = req.params;

  if (!reactiveToken) {
    return next(new Error("Recovery token is required", { cause: 400 }));
  }

  const decoded = verifyToken({
    payload: reactiveToken,
    signature: process.env.RECOVER_ACCOUNT_SIGNATURE,
  });

  if (!decoded?.email) {
    return next(new Error("Invalid or expired token", { cause: 400 }));
  }

  const existingUser = await userModel.findOne({ email: decoded.email });

  if (!existingUser) {
    return next(new Error("User not found", { cause: 404 }));
  }

  if (!existingUser.isDeleted) {
    return next(new Error("Account is already active", { cause: 400 }));
  }
  if (new Date() > new Date(existingUser.permanentlyDeleted)) {
    return next(new Error("Recovery period has expired", { cause: 410 }));
  }

  const result = await userModel.findOneAndUpdate(
    { email: decoded.email, isDeleted: true },
    {
      isDeleted: false,
      $unset: { permanentlyDeleted: 1 },
      status: "Active",
      lastRecovered: new Date(),
    },
    { new: true }
  );

  return res.status(200).json({
    status: "success",
    message: "Your account has been successfully recovered",
    result,
    recoveredAt: new Date(),
  });
});

//====================================================================================================================//
//profile pic
export const uploadProfilePic = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(
      new Error("Please select your profile picture", { cause: 400 })
    );
  }
  const user = await userModel
    .findById(req.user._id)
    .select("customId profileURL");
  if (!user) {
    return next(new Error("User not found.", { cause: 404 }));
  }

  const profilePic = await uploadToCloudinary(
    req.file,
    `${process.env.APP_NAME}/Users/${user.customId}`,
    `${user.customId}profilePic`
  );

  user.profileURL = profilePic;
  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Profile Picture uploaded successfully",
    user: user,
  });
});

//====================================================================================================================//
//cover pic uploadCoverPic
export const uploadCoverPic = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("Please select your cover picture", { cause: 400 }));
  }

  const user = await userModel.findById(req.user._id);
  if (!user) {
    return next(new Error("User not found.", { cause: 404 }));
  }

  const coverPic = await uploadToCloudinary(
    req.file,
    `${process.env.APP_NAME}/Users/${user.customId}`,
    `${user.customId}coverPic`
  );

  user.coverURL = coverPic;
  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Cover Picture uploaded successfully",
    user: user,
  });
});

//====================================================================================================================//
// Get User Follows

export const getUserFollows = asyncHandler(async (req, res, next) => {
  const selectItems =
    "userName firstName lastName headline profileURL follow.accepted";

    let { page = 1, size = 3 } = req.query;
    page = Math.max(parseInt(page, 10) || 1, 1); 
    size = Math.min(Math.max(parseInt(size, 10) || 3, 1), 10); 
    const skip = (page - 1) * size;

  const user = await userModel
    .findById(req.user._id)
    .populate([
      {
        path: "follow.accepted",
        select: selectItems,
        options: { 
          skip,
          limit: size,
          sort: { firstName: 1, lastName: 1 } 
        }
      },
      {
        path: "follow.requested",
        select: selectItems,
        options: { 
          skip,
          limit: size,
          sort: { createdAt: -1 } 
        }
      },
    ])
    .select("follow");
    const totalAcceptedPages = Math.ceil(user.follow.accepted.length / size);
    const totalRequestedPages = Math.ceil(user.follow.requested.length / size);

  return res
    .status(200)
    .json({
      status: "success",
      pagination: {
        current_page: page,
        size,
        total_accepted: user.follow.accepted.length,
        total_requested: user.follow.requested.length,
        total_accepted_pages: totalAcceptedPages,
        total_requested_pages: totalRequestedPages,
        has_next_page: (page < totalAcceptedPages) || (page < totalRequestedPages)
      },
      data: {
        accepted: user.follow.accepted,
        requested: user.follow.requested
      }
    });
});

//====================================================================================================================//
// Request follow

export const requestFollow = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  if (currentUserId.equals(userId)) {
    return next(new Error("You cannot send a follow request to yourself", { cause: 400 }));
  }

  const user = await userModel.findById(userId, 'follow.requested');
  
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  if (user.follow.requested.some(id => id.equals(currentUserId))) {
    return next(new Error("Follow request has already been sent to this user", { cause: 409 }));
  }

  const result = await userModel.findByIdAndUpdate(
    userId,
    { $addToSet: { 'follow.requested': currentUserId } },
    { new: true, runValidators: true }
  );

  if (!result) {
    return next(new Error("Failed to send follow request", { cause: 500 }));
  }

  return res.status(200).json({ 
    status: "success", 
    message: "Follow request sent successfully" 
  });
});