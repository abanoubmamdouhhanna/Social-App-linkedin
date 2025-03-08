import joi from "joi";
import { generalFeilds } from "../../../middlewares/validation.middleware.js";

const REACTION_TYPES = [
  "like",
  "celebrate",
  "support",
  "insightful",
  "funny",
  "love",
];
const MAX_IMAGES = 10;

const ERROR_MESSAGES = {
  objectBase: "Input must be a valid object.",
  postIdRequired: "Post ID is required",
  invalidReaction: `Reaction must be one of: ${REACTION_TYPES.join(", ")}`,
};

export const headersSchema= generalFeilds.headers


/**
 * Validates post creation with images and content
 */
export const addPostSchema = joi
  .object({
    file: joi.object({
      postImages: joi
        .array()
        .items(generalFeilds.file)
        .min(1)
        .max(MAX_IMAGES)
        .messages({
          "array.min": "At least one image is required",
          "array.max": `Maximum of ${MAX_IMAGES} images allowed`,
        }),
    }),

    postContent: joi.string().trim().messages({
      "string.empty": "Post content is required",
      "any.required": "Post content is required",
    }),
  })
  .required()
  .messages({
    "object.base": ERROR_MESSAGES.objectBase,
  });

/**
 * Validates post update with images, and content
 */
export const updatePostSchema = joi
  .object({
    file: joi.object({
      postImages: joi
        .array()
        .items(generalFeilds.file)
        .min(1)
        .max(MAX_IMAGES)
        .messages({
          "array.min": "At least one image is required",
          "array.max": `Maximum of ${MAX_IMAGES} images allowed`,
        }),
    }),
    postId: generalFeilds.id.required().messages({
      "any.required": ERROR_MESSAGES.postIdRequired,
      "string.empty": ERROR_MESSAGES.postIdRequired,
    }),

    postContent: joi.string().trim().messages({
      "string.empty": "Post content is required",
      "any.required": "Post content is required",
    }),
  })
  .required()
  .messages({
    "object.base": ERROR_MESSAGES.objectBase,
  });

/**
 * Validates post reaction operations
 */
export const addReactSchema = joi
  .object({
    postId: generalFeilds.id.required().messages({
      "any.required": ERROR_MESSAGES.postIdRequired,
      "string.empty": ERROR_MESSAGES.postIdRequired,
    }),

    react: joi
      .string()
      .valid(...REACTION_TYPES)
      .required()
      .messages({
        "any.only": ERROR_MESSAGES.invalidReaction,
        "string.empty": "Reaction type is required",
        "any.required": "Reaction type is required",
      }),
  })
  .required()
  .messages({
    "object.base": ERROR_MESSAGES.objectBase,
  });

/**
 * Validates operations that only require a post ID
 */
export const postIdSchema = joi
  .object({
    postId: generalFeilds.id.required().messages({
      "any.required": ERROR_MESSAGES.postIdRequired,
      "string.empty": ERROR_MESSAGES.postIdRequired,
    }),
  })
  .required()
  .messages({
    "object.base": ERROR_MESSAGES.objectBase,
  });

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
  "object.base": ERROR_MESSAGES.objectBase,
});

/**
 * Validates private Post Schema
 */
export const privatePostSchema = joi
  .object({
    postId: generalFeilds.id.required().messages({
      "any.required": ERROR_MESSAGES.postIdRequired,
      "string.empty": ERROR_MESSAGES.postIdRequired,
    }),
    privacy: joi.string().valid("true", "false").required().messages({
      "any.only": `Reaction must be one of: "true" , "false"`,
      "string.empty": "Privacy is required",
      "any.required": "Privacy is required",
    }),
  })
  .required()
  .messages({
    "object.base": ERROR_MESSAGES.objectBase,
  });
