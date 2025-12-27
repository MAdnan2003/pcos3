import mongoose from "mongoose";

const ForumPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    anonymousName: {
      type: String,
      required: true, // e.g. "Anonymous Panda"
      maxlength: 40,
    },
    title: {
      type: String,
      required: true,
      maxlength: 120,
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ForumPost", ForumPostSchema);
