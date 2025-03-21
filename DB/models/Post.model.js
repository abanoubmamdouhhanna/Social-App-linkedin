import mongoose, { model, Schema, Types } from "mongoose";

const postSchema = new Schema(
  {
    customId: String,
    postContent: {
      type: String,
      trim: true,
      maxlength: [5000, "Post content cannot exceed 5000 characters"],
    },
    reactions: {
      like: [{ type: Types.ObjectId, ref: "User" }],
      celebrate: [{ type: Types.ObjectId, ref: "User" }],
      support: [{ type: Types.ObjectId, ref: "User" }],
      insightful: [{ type: Types.ObjectId, ref: "User" }],
      funny: [{ type: Types.ObjectId, ref: "User" }],
      love: [{ type: Types.ObjectId, ref: "User" }],
    },
    postImages: [{ type: String, required: true }],
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    viewCount: {
      type: Number,
      default: 0,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = undefined;
        ret.reactionCount = Object.values(ret.reactions || {}).reduce(
          (sum, reactions) => sum + (reactions ? reactions.length : 0),
          0
        );
      },
    },
    toObject: { virtuals: true },
  }
);
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
  options: {
    sort: { createdAt: -1 },
  },
});
postSchema.pre("find", function () {
  this.where({ isDeleted: false });
});
postSchema.statics.findByTag = function (tagName) {
  return this.find({ tags: tagName.toLowerCase() });
};

postSchema.methods.incrementViews = async function () {
  this.viewCount += 1;
  await this.save();
  return this;
};

const postModel = mongoose.models.Post || model("Post", postSchema);
export default postModel;
