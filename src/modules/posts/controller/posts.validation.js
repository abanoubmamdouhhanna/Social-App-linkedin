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
const tags = joi
  .array()
  .items(joi.string().trim().min(2).max(30))
  .unique() // Prevents duplicate tags
  .min(0) // Allow empty array
  .max(10) // Limit number of tags
  .default([]) // Default to empty array
  .messages({
    "array.unique": "Duplicate tags are not allowed",
    "array.max": "Maximum of 10 tags allowed",
    "string.min": "Each tag must be at least 2 characters",
    "string.max": "Each tag must be at most 30 characters",
    "string.empty": "Tag cannot be empty",
  })
  .description("List of tags associated with the content");

export const headersSchema = generalFeilds.headers;

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
    tags: tags,
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
/**
 * Validates add/remove tag to/from Post Schema
 */
export const addTagsToPostSchema = joi
  .object({
    postId: generalFeilds.id.required().messages({
      "any.required": ERROR_MESSAGES.postIdRequired,
      "string.empty": ERROR_MESSAGES.postIdRequired,
    }),
    tags: tags,
  })
  .required()
  .messages({
    "object.base": ERROR_MESSAGES.objectBase,
  });

/**
 * Validates get post by tag Schema
 */
export const getPostsByTagSchema = joi
  .object({
    tagName: joi.string().trim().min(2).max(30),
  })
  .required()
  .messages({
    "object.base": ERROR_MESSAGES.objectBase,
  });
