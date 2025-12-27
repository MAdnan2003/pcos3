import mongoose from "mongoose";

const ForumCommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "ForumPost",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    anonymousName: {
      type: String,
      required: true,
      maxlength: 40,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ForumComment", ForumCommentSchema);
