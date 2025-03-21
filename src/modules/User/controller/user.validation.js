import joi from "joi";
import { generalFeilds } from "../../../middlewares/validation.middleware.js";

export const headersSchema = generalFeilds.headers;

export const updateUserSchema = joi
  .object({
    userName: generalFeilds.userName,
    phone: generalFeilds.phone,
    DOB: joi.string(),
    age: generalFeilds.age,
    gender: generalFeilds.gender,
  })
  .required();

export const changePasswordSchema = joi
  .object({
    oldPassword: generalFeilds.password,
    newPassword: generalFeilds.password.invalid(joi.ref("oldPassword")),
    cPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();


    /**
   * Validates operations that only require a user ID
   */
  export const userIdSchema = joi
  .object({
    userId: generalFeilds.id.required().messages({
      "any.required": "User ID is required",
      "string.empty": "User ID is required",
    }),
  })
  .required()