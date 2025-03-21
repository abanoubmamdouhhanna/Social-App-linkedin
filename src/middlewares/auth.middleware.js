import userModel from "../../DB/models/User.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { verifyToken } from "../utils/generateAndVerifyToken.js";

export const auth = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return next(new Error("Authorization is required", { cause: 400 }));
    }
    const decoded = verifyToken({
      payload: authorization,
      signature: process.env.SIGNATURE,
    });
    if (!decoded?.id) {
      return next(new Error("In-valid token payload", { cause: 401 }));
    }
    const authUser = await userModel.findById(decoded.id);
    if (!authUser) {
      return next(new Error("not register account", { cause: 401 }));
    }
    // Check if user is active
    if (authUser.status !== "Active") {
      return next(
        new Error("Account is inactive or suspended", { cause: 403 })
      );
    }
    if (authUser.availability == "Offline") {
      return next(new Error("You are not logged in", { cause: 409 }));
    }
    if (parseInt(authUser.changeAccountInfo?.getTime() / 1000) > decoded.iat) {
      return next(
        new Error("Expired token ,please login again", { cause: 400 })
      );
    }
    if (!authUser.isConfirmed) {
      return next(new Error("You must activate your email", { cause: 409 }));
    }
    if (authUser.isDeleted || authUser.isBlocked) {
      return next(
        new Error(
          "Your account suspended or removed , contact support for more information",
          { cause: 403 }
        )
      );
    }
    if (!accessRoles.includes(authUser.role)) {
      return next(
        new Error("You aren't authorized to take this action!", { cause: 403 })
      );
    }
    req.user = authUser;
    return next();
  });
};
