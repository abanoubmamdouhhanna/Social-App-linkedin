import joi from "joi";
import { Types } from "mongoose";
const checkObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("Invalid ObjectId");
};
export const generalFeilds = {
  id: joi.string().custom(checkObjectId).required(),
  optionalId: joi.string().custom(checkObjectId),

  userName: joi.string().min(3).max(20).messages({
    "any.required": "username is required",
    "string.empty": "username cant't be empty",
    "string.base": "username should be a type of string!",
    "string.min": "username should be at least 3 characters!",
    "string.max": "username should be less than 20 characters!",
  }),
  firstName: joi.string().min(3).max(20).messages({
    "any.required": "firstName is required",
    "string.empty": "firstName cant't be empty",
    "string.base": "firstName should be a type of string!",
    "string.min": "firstName should be at least 3 characters!",
    "string.max": "firstName should be less than 20 characters!",
  }),
  lastName: joi.string().min(3).max(20).messages({
    "any.required": "lastName is required",
    "string.empty": "lastName cant't be empty",
    "string.base": "lastName should be a type of string!",
    "string.min": "lastName should be at least 3 characters!",
    "string.max": "lastName should be less than 20 characters!",
  }),

  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .messages({
      "string.email": "Email must be valid!!",
      "string.empty": "Email is not allowed to be empty",
    }),

   userNameOrEmail : joi
  .alternatives()
  .try(
    joi.string().min(3).max(20),
    joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).messages({
      "string.email": "Email must be valid!",
      "string.empty": "Email is not allowed to be empty",
    })
  )
  .messages({
    "any.required": "userNameOrEmail is required",
  }),

  age: joi.number().min(18).max(80).messages({
    "any.required": "Age is required",
    "number.base": "Age must be number",
    "number.min": " must be greater than or equal to 18",
    "number.max": "Age must be less than or equal to 80",
  }),

  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)

    .messages({
      "string.pattern.base":
        "password must be at least eight characters long, with at least one letter and one number",
    }),

  cPassword: joi.string().messages({
    "any.only": "The confirmation password must be the same as the password",
  }),

  gender: joi.valid("male", "female").messages({
    "any.only": "Gender must be one of male or female!",
  }),
  phone: joi
    .string()
    .pattern(/^(\+2)?01[0125][0-9]{8}$/)
    .messages({ "string.pattern.base": "please Enter a valid phone Number" }),

  name: joi.string().min(3).max(50).messages({
    "any.required": "name is required",
    "string.empty": "name cant't be empty",
    "string.base": "name should be a type of string!",
    "string.min": "name should be at least 3 characters!",
    "string.max": "name should be less than 50 characters!",
  }),
  brandName: joi.string().min(2).max(50).messages({
    "any.required": "brandName is required",
    "string.empty": "brandName cant't be empty",
    "string.base": "brandName should be a type of string!",
    "string.min": "brandName should be at least 3 characters!",
    "string.max": "brandName should be less than 50 characters!",
  }),
  ProductName: joi.string().min(2).max(50).messages({
    "any.required": "ProductName is required",
    "string.empty": "ProductName cant't be empty",
    "string.base": "ProductName should be a type of string!",
    "string.min": "ProductName should be at least 3 characters!",
    "string.max": "ProductName should be less than 50 characters!",
  }),
  description: joi.string().min(20).messages({
    "any.required": "description is required",
    "string.empty": "description cant't be empty",
    "string.base": "description should be a type of string!",
    "string.min": "description should be at least 20 characters!",
  }),
  price: joi.number().positive().min(1).messages({
    "any.required": "Price is required",
    "number.base": "Price must be number",
    "number.min": " must be greater than or equal to 1",
    "number.positive": "must be positive number",
  }),
  discont: joi.number().positive().min(1).messages({
    "any.required": "Discount is required",
    "number.base": "Discount must be number",
    "number.min": " must be greater than or equal to 1",
    "number.positive": "must be positive number",
  }),
  quantity: joi.number().integer().positive().min(1).messages({
    "any.required": "Quantity is required",
    "number.base": "Quantity must be number",
    "number.min": " must be greater than or equal to 1",
    "number.positive": "must be positive number",
    "number.integer": "must be an integer number",
  }),
  otp: joi
    .string()
    .alphanum()
    .length(8)
    .required()
    .messages({ "string.length": "Invalid OTP code" }),

  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),
  headers: joi.object({
    authorization: joi
      .string()
      .regex(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/)
      .required(),
  }),
};

//////  Validation   ///////////////
export const isValid = (joiSchema, considerHeaders = false) => {
  return (req, res, next) => {
    let copyReq = {
      ...req.body,
      ...req.params,
      ...req.query,
    };
    if (req.headers?.authorization && considerHeaders) {
      copyReq = { authorization: req.headers.authorization };
    }
    if (req.files || req.file) {
      copyReq.file = req.files || req.file;
    }

    const { error } = joiSchema.validate(copyReq, { abortEarly: false });
    if (error) {
      return res
        .status(422)
        .json({ message: "Validation Error",status_code: 422, Error: error.message });
    } else {
      return next();
    }
  };
};
