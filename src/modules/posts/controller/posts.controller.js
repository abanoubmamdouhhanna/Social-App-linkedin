import { nanoid } from "nanoid";
import postModel from "../../../../DB/models/Post.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import userModel from "../../../../DB/models/User.model.js";
import reactionList from "../../../utils/reactionList.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../../../utils/cloudinaryHelpers.js";

const populateAllReplies = (depth) => {
  let populateConfig = {
    path: "reply",
    populate: {},
  };

  if (depth > 1) {
    populateConfig.populate = populateAllReplies(depth - 1);
  } else {
    populateConfig.populate = {
      path: "createdBy",
      select: "firstName lastName email profileURL",
    };
  }

  return populateConfig;
};


//get all posts for logged in account or friends posts //newsfeed
export const getAllPosts = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  const AllPosts = await postModel
    .find({
      $or: [
        { createdBy: { $in: user.follow.accepted } },
        { createdBy: req.user._id },
      ],
      isPrivate: false,
    })
    .populate([
      {
        path: "createdBy",
        select:"firstName lastName email profileURL ",
      },
      ...reactionList,
      // {
      //   path: "comments",
      //   populate: [
      //     {
      //       path: "createdBy",
      //       select:"firstName lastName email profileURL",
      //     },
      //     ...reactionList,
      //     {
      //       path: "reply",
      //       populate: [
      //         populateAllReplies(10),
      //         ...reactionList,
      //       ],
      //     },
      //   ],
      // },
    ]);
  const posts = AllPosts.filter((post) => post.createdBy != null);
  await Promise.all(posts.map((post) => post.incrementViews()));
  const postsWithReactionFlag = posts.map((post) => {
    const postObj = post.toObject
      ? post.toObject()
      : JSON.parse(JSON.stringify(post));

    const hasReacted = post.reactions
      ? Object.values(post.reactions).some(
          (reactions) =>
            Array.isArray(reactions) &&
            reactions.some(
              (reaction) =>
                reaction?.equals?.(req.user._id) ||
                reaction?.toString() === req.user._id.toString()
            )
        )
      : false;

    return { ...postObj, hasReacted };
  });

  return res.status(200).json({
    status: "success",
    posts_count: postsWithReactionFlag.length,
    results: postsWithReactionFlag,
  });
});

//====================================================================================================================//
//get all posts for logged in user

export const getMyAllPosts = asyncHandler(async (req, res, next) => {
  const AllPosts = await postModel
    .find({
      createdBy: req.user._id,
    })
    .populate([
      {
        path: "createdBy",
        select: "userName profileURL",
      },
      ...reactionList,
      // {
      //   path: "comments",
      //   select: "text createdBy replies",
      //   populate: [
      //     {
      //       path: "createdBy",
      //       select: "userName profileURL",
      //     },
      //     ...reactionList,
      //     {
      //       path: "replies",
      //       select: "text createdBy",
      //       populate: [
      //         {
      //           path: "createdBy",
      //           select: "userName profileURL",
      //         },
      //         ...reactionList,
      //       ],
      //     },
      //   ],
      // },
    ]);
  const posts = AllPosts.filter((post) => post.createdBy != null);
  await Promise.all(posts.map((post) => post.incrementViews()));
  const postsWithReactionFlag = posts.map((post) => {
    const postObj = post.toObject
      ? post.toObject()
      : JSON.parse(JSON.stringify(post));

    const hasReacted = post.reactions
      ? Object.values(post.reactions).some(
          (reactions) =>
            Array.isArray(reactions) &&
            reactions.some(
              (reaction) =>
                reaction?.equals?.(req.user._id) ||
                reaction?.toString() === req.user._id.toString()
            )
        )
      : false;

    return { ...postObj, hasReacted };
  });

  return res.status(200).json({
    status: "success",
    posts_count: postsWithReactionFlag.length,
    results: postsWithReactionFlag,
  });
});

//====================================================================================================================//
//get all posts for sp user

export const getUserAllPosts = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({
    _id: req.params.userId,
    isDeleted: false,
  });
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const AllPosts = await postModel
    .find({ createdBy: req.params.userId, isPrivate: false })
    .populate([
      {
        path: "createdBy",
        select: "userName profileURL",
      },
      ...reactionList,
      // {
      //   path: "comments",
      //   select: "text createdBy replies",
      //   populate: [
      //     {
      //       path: "createdBy",
      //       select: "userName profileURL",
      //     },
      //     ...reactionList,
      //     {
      //       path: "replies",
      //       select: "text createdBy",
      //       populate: [
      //         {
      //           path: "createdBy",
      //           select: "userName profileURL",
      //         },
      //         ...reactionList,
      //       ],
      //     },
      //   ],
      // },
    ]);
  const posts = AllPosts.filter((post) => post.createdBy != null);
  await Promise.all(posts.map((post) => post.incrementViews()));
  const postsWithReactionFlag = posts.map((post) => {
    const postObj = post.toObject
      ? post.toObject()
      : JSON.parse(JSON.stringify(post));

    const hasReacted = post.reactions
      ? Object.values(post.reactions).some(
          (reactions) =>
            Array.isArray(reactions) &&
            reactions.some(
              (reaction) =>
                reaction?.equals?.(req.user._id) ||
                reaction?.toString() === req.user._id.toString()
            )
        )
      : false;

    return { ...postObj, hasReacted };
  });

  return res.status(200).json({
    status: "success",
    posts_count: postsWithReactionFlag.length,
    results: postsWithReactionFlag,
  });
});

//====================================================================================================================//
//add post
export const addPost = asyncHandler(async (req, res, next) => {
  const { postContent,tags } = req.body;
  if ( !postContent) {
    return next(new Error("Content is required", { cause: 400 }));
  }
if (tags) {
  const formattedTags = Array.isArray(tags)
  ? tags.map((tag) => tag.trim().toLowerCase())
  : []; 
  req.body.tags=formattedTags
}
  const customId = nanoid();
  if (req.files?.postImages?.length) {
    const uploadedImages = await Promise.all(
      req.files.postImages.map((file, index) =>
        uploadToCloudinary(
          file,
          `${process.env.APP_NAME}/Post/${customId}`,
          `${customId}_postImage_${index}`
        )
      )
    );

    req.body.postImages = uploadedImages;
  }

  req.body.createdBy = req.user._id;
  req.body.authorType = req.user.role;
  req.body.customId = customId;
  const addPost = await postModel.create(req.body);
  return res.status(201).json({
    status: "success",
    message: "Post created successfully",
    result: addPost,
  });
});

//====================================================================================================================//
//update post
export const updatePost = asyncHandler(async (req, res, next) => {
  const { postContent } = req.body;
  if (!postContent && !req.files?.postImages?.length) {
    return next(new Error("No changes provided for update", { cause: 400 }));
  }

  const post = await postModel.findById(req.params.postId);
  if (!post) {
    return next(new Error("Post not found", { cause: 404 }));
  }

  if (post.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new Error("Not authorized to update this post", { cause: 403 })
    );
  }

  if (postContent) {
    post.postContent = postContent;
  }

  if (req.files?.postImages?.length) {
    const folderPath = `${process.env.APP_NAME}/Post/${post.customId}`;
    try {
      await deleteFromCloudinary(folderPath);
      const uploadedImages = await Promise.all(
        req.files.postImages.map((file, index) =>
          uploadToCloudinary(
            file,
            folderPath,
            `${post.customId}_postImage_${index}`
          )
        )
      );

      post.postImages = uploadedImages;
    } catch (error) {
      return next(
        new Error(`Error processing images: ${error.message}`, { cause: 500 })
      );
    }
  }
  await post.save();

  return res.status(200).json({
    status: "success",
    message: "Post updated successfully",
    result: post, // Return the updated document directly
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
      ) //object of key = value //reactions is object reactionType is key [like] is value == reactions[like]=[like]
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
//====================================================================================================================//
// Delete post

export const deletePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  // Find the post to get its customId
  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      status: "fail",
      message: "Post not found",
    });
  }

  // Verify the user is authorized to delete this post
  if (post.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: "fail",
      message: "You are not authorized to delete this post",
    });
  }

  if (post.postImages && post.postImages.length > 0) {
    const folderPath = `${process.env.APP_NAME}/Post/${post.customId}`;

    try {
      await deleteFromCloudinary(folderPath);
    } catch (error) {
      console.error("Error deleting images from Cloudinary:", error);
    }
  }

  // Delete the post from the database
  await postModel.findByIdAndDelete(postId);

  return res.status(200).json({
    status: "success",
    message: "Post deleted successfully",
  });
});

//====================================================================================================================//
// Delete post by admin

export const deletePostByAdmin = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  // Find the post to get its customId
  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      status: "fail",
      message: "Post not found",
    });
  }

  if (post.postImages && post.postImages.length > 0) {
    const folderPath = `${process.env.APP_NAME}/Post/${post.customId}`;

    try {
      await deleteFromCloudinary(folderPath);
    } catch (error) {
      console.error("Error deleting images from Cloudinary:", error);
    }
  }

  // Delete the post from the database
  await postModel.findByIdAndDelete(postId);

  return res.status(200).json({
    status: "success",
    message: "Post deleted successfully",
  });
});
//====================================================================================================================//
//make post private
export const privatePost = asyncHandler(async (req, res, next) => {
  const { privacy } = req.query;
  const { postId } = req.params;
  const post = await postModel
    .findOneAndUpdate(
      { _id: postId, createdBy: req.user._id },
      { isPrivate: privacy },
      { new: true }
    )
    .select("isPrivate");
  if (!post) {
    return next(new Error("you are not the owner of the post", { cause: 403 }));
  }
  return res.status(200).json({
    status: "success",
    message: "Post privacy updated",
    result: post,
  });
});

//====================================================================================================================//
//add tag to post

export const addTagsToPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { tags } = req.body;

  if (!tags || !Array.isArray(tags)) {
    return next(new Error("Tags must be an array", { cause: 400 }));
  }

  const formattedTags = tags.map((tag) => tag.trim().toLowerCase());

  const updatedPost = await postModel.findByIdAndUpdate(
    postId,
    { $addToSet: { tags: { $each: formattedTags } } }, // Prevents duplicate tags
    { new: true }
  );

  if (!updatedPost) {
    return next(new Error("Post not found", { cause: 404 }));
  }

  return res.status(200).json({
    status: "success",
    message: "Tags added successfully",
    post: updatedPost,
  });
});

//====================================================================================================================//
//remove tag from post

export const removeTagFromPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { tag } = req.body;

  if (!tag) {
    return next(new Error("Tag is required", { cause: 400 }));
  }

  const updatedPost = await postModel.findByIdAndUpdate(
    postId,
    { $pull: { tags: tag.toLowerCase() } }, // Removes tag from array
    { new: true }
  );

  if (!updatedPost) {
    return next(new Error("Post not found", { cause: 404 }));
  }

  return res.status(200).json({
    status: "success",
    message: "Tag removed successfully",
    post: updatedPost,
  });
});

//====================================================================================================================//
//get post by tag
export const getPostsByTag = asyncHandler(async (req, res, next) => {
  const { tagName } = req.params;

  const posts = await postModel.findByTag(tagName);

  return res.status(200).json({
    status: "success",
    posts_count: posts.length,
    posts,
  });
});
