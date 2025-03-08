import joi from "joi";
import { generalFeilds } from "../../../middlewares/validation.middleware.js";


export const headersSchema= generalFeilds.headers

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
.messages({
  "object.base":"Input must be a valid object.",
});
