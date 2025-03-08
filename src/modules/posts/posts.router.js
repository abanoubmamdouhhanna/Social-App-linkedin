import { Router } from "express";
import { allowedTypesMap, fileUpload } from "../../utils/multerCloudinary.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import * as postController from "./controller/posts.controller.js";
import {
  addPostSchema,
  addReactSchema,
  headersSchema,
  postIdSchema,
  privatePostSchema,
  updatePostSchema,
  userIdSchema,
} from "./controller/posts.validation.js";

const router = Router();

//get all posts for logged in account or friends posts
router.get(
  "/getAllPosts",
  isValid(headersSchema, true),
  auth(["admin", "user"]),
  postController.getAllPosts
);

//get all posts for loggedin user
router.get(
  "/getMyAllPosts",
  isValid(headersSchema, true),
  auth(["admin", "user"]),
  postController.getMyAllPosts
);

//get all posts for sp user
router.get(
  "/getUserAllPosts/:userId",
  isValid(headersSchema, true),
  auth(["admin", "user"]),
  isValid(userIdSchema),
  postController.getUserAllPosts
);

//add post
router.post(
  "/addPost",
  isValid(headersSchema, true),
  auth(["admin", "user"]),
  fileUpload(2, allowedTypesMap).fields([
    {
      name: "postImages",
      maxCount: 10,
    },
  ]),
  isValid(addPostSchema),
  postController.addPost
);

//update post
router.patch(
  "/updatePost/:postId",
  isValid(headersSchema, true),
  auth(["admin", "user"]),
  fileUpload(2, allowedTypesMap).fields([
    {
      name: "postImages",
      maxCount: 10,
    },
  ]),
  isValid(updatePostSchema),
  postController.updatePost
);

//add react to post
router.patch(
  "/addReact/:postId/:react",
  isValid(headersSchema, true),
  auth(["admin", "user"]),
  isValid(addReactSchema),
  postController.addReact
);

//remove react from post
router.patch(
  "/removeReact/:postId",
  isValid(headersSchema, true),
  auth(["admin", "user"]),
  isValid(postIdSchema),
  postController.removeReact
);

//delete post
router.delete(
  "/deletePost/:postId",
  isValid(headersSchema, true),
  auth(["admin", "user"]),
  isValid(postIdSchema),
  postController.deletePost
);

//delete post by amin
router.delete(
  "/deletePostByAdmin/:postId",
  isValid(headersSchema, true),
  auth(["admin"]),
  isValid(postIdSchema),
  postController.deletePostByAdmin
);

//make post private
router.patch(
  "/privatePost/:postId",
  isValid(headersSchema, true),
  auth(["admin", "user"]),
  isValid(privatePostSchema),
  postController.privatePost
);
export default router;
