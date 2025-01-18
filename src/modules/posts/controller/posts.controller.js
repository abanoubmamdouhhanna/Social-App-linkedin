import { nanoid } from "nanoid";
import postModel from "../../../../DB/models/Post.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import userModel from "../../../../DB/models/User.model.js";
import reactionList from "../../../utils/reactionList.js";

export const getAllPosts = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  const AllPosts = await postModel
    .find({
      $or: [
        { createdBy: { $in: user.connections.accepted } },
        { createdBy: req.user._id },
      ],
      isPrivate: false,
    })
    .populate([
      {
        path: "createdBy",
        select: "userName profileURL",
      },
      ...reactionList,
      {
        path: "comments",
        select: "text createdBy replies",
        populate: [
          {
            path: "createdBy",
            select: "userName profileURL",
          },
          ...reactionList,
          {
            path: "replies",
            select: "text createdBy",
            populate: [
              {
                path: "createdBy",
                select: "userName profileURL",
              },
              ...reactionList,
            ],
          },
        ],
      },
    ]);
  const posts = AllPosts.filter((post) => post.userId != null);
  return res
    .status(200)
    .json({ status: "success", posts_count: posts.length, results: posts });
});

//add post
export const addPost = asyncHandler(async (req, res, next) => {
  let uploadedImages = [];

  if (req.files?.postImages?.length) {
    const customId = nanoid();
    req.body.customId = customId;
    uploadedImages = await Promise.all(
      req.files.postImages.map(async (image, index) =>
        cloudinary.uploader
          .upload(image.path, {
            folder: `${process.env.APP_NAME}/Gallery/${customId}/postImages`,
            public_id: `${customId}postImages___${index + 1}`,
          })
          .then((uploadResult) => ({
            imageUrl: uploadResult.secure_url,
          }))
          .catch(() => {
            throw new Error("Failed to upload image", { cause: 500 }); // Error handling per image upload failure
          })
      )
    );
    req.body.postImages = uploadedImages;
  }
  req.body.createdBy = req.user._id;
  req.body.authorType = req.user.role;
  const addPost = await postModel.create(req.body);
  return res.status(201).json({
    status: "success",
    message: "Post created successfully",
    result: addPost,
  });
});

//====================================================================================================================//
//add react

export const addReact = asyncHandler(async (req, res, next) => {
  const { postId, react } = req.params;
  const userId = req.user._id;

  const post = await postModel.findById(postId);
  if (!post) {
    return next(new Error("Post ID not exist", { cause: 404 }));
  }
  if (!Object.keys(post.reactions).includes(react)) {
    return next(new Error("Invalid reaction type", { cause: 400 }));
  }

  // Remove user ID from all reaction types
  for (const reactionType of Object.keys(post.reactions)) {
    if (
      post.reactions[reactionType].some(
        (id) => id.toString() === userId.toString()
      )
    ) {
      post.reactions[reactionType] = post.reactions[reactionType].filter(
        (id) => id.toString() !== userId.toString()
      );
    }
  }

  // Add user ID to the specified reaction type
  post.reactions[react].push(userId);

  // Save the updated post
  await post.save();
  return res.status(201).json({ message: "Reacted", post });
});

//====================================================================================================================//
//remove react

export const removeReact = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await postModel.findById(postId);
  if (!post) {
    return next(new Error("Post ID not exist", { cause: 404 }));
  }

  // Remove user ID from all reaction types
  for (const reactionType of Object.keys(post.reactions)) {
    if (
      post.reactions[reactionType].some(
        (id) => id.toString() === userId.toString()
      )
    ) {
      post.reactions[reactionType] = post.reactions[reactionType].filter(
        (id) => id.toString() !== userId.toString()
      );
    }
  }
  // Save the updated post
  await post.save();
  return res.status(201).json({ message: "React removed", post });
});
