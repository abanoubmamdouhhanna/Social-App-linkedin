import mongoose, { model, Schema, Types } from "mongoose";

const userSchema = new Schema(
  {customId:String,
    userName: {
    type: String,
    min: 3,
    max: 20,
    required: [true, "userName is required"],
  },
    firstName: {
      type: String,
      min: 3,
      max: 20,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      min: 3,
      max: 20,
      required: [true, "lastName is required"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "not Active",
      enum: ["Active", "not Active"],
    },
    availability: {
      type: String,
      default: "Offline",
      enum: ["Online", "Offline"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
    gender: {
      type: String,
      default: "male",
      enum: ["male", "female"],
      required: true,
    },
    follow: {
      requested: [{ type: Types.ObjectId, ref: "User" }],
      accepted: [{ type: Types.ObjectId, ref: "User" }],
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    DOB: Date,
    headline: String,
    activationCode: String,
    otp: String,
    otpexp: Date,
    profileURL: String,
    coverURL: String,
    changeAccountInfo: Date,
    permanentlyDeleted: Date,
    lastRecovered:Date
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = undefined;
      },
    },
    toObject: { virtuals: true },
  }
);
userSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

userSchema.virtual("profilePicId").get(function () {
  return `${process.env.APP_NAME}/users/${this._id}/profile/${this._id}profilePic`;
});
userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "createdBy",
});

userSchema.index({ permanentlyDeleted: 1 }, { expireAfterSeconds: 0 });

const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
