import { Router } from "express";
import { allowedTypesMap, fileUpload } from "../../utils/multerCloudinary.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import * as postController from "./controller/posts.controller.js";
import { addPostSchema } from "./controller/posts.validation.js";
import { headersSchema } from "../Auth/controller/auth.validation.js";

const router = Router();

//add post
router.post(
  "/addPost",
  isValid(headersSchema, true),
  auth(["admin","user"]),
  fileUpload(2, allowedTypesMap).fields([
    {
      name: "postImages",
      maxCount: 10,
    },
  ]),
  isValid(addPostSchema),
  postController.addPost
);

//add react to post
router.patch(
  "/addReact/:postId/:react",
  isValid(headersSchema, true),
  auth(["admin","user"]),
  postController.addReact
);

//add react to post
router.patch(
  "/removeReact/:postId",
  isValid(headersSchema, true),
  auth(["admin","user"]),
  postController.removeReact
);
export default router;
