import joi from "joi";
import { generalFeilds } from "../../../middlewares/validation.middleware.js";

export const addPostSchema = joi
  .object({
    file: joi.object({
      postImages: joi.array().items(generalFeilds.file).max(10),
    }),

    postTitle: joi.string().required(),

    postContent: joi.string().required(),
  })
  .required()
  .messages({
    "object.base": "Input must be a valid object.",
  });