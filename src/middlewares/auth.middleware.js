import UserModel from "../../DB/models/User.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { verifyToken } from "../utils/generateAndVerifyToken.js";

// export const roles = {
//   SuperAdmin: "superAdmin",
//   Admin: "admin",
//   User: "user",
// };
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
    const authUser = await UserModel.findById(decoded.id);
    if (!authUser) {
      return next(new Error("not register account", { cause: 401 }));
    }
    if (parseInt(authUser.changeAccountInfo?.getTime() / 1000) > decoded.iat) {
      return next(new Error("Expired token ,please login again", { cause: 400 }));
    }
    if (!authUser.isConfirmed) {
      return next(new Error("You must activate your email", { cause: 400 }));
    }
    if (!accessRoles.includes(authUser.role)) {
      return next(
        new Error("You aren't authorized to take this action!", { cause: 400 })
      );
    }
    req.user = authUser;
    return next();
  });
};
