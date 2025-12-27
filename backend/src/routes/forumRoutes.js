import express from "express";
import auth from "../middleware/auth.js";
import ForumPost from "../models/ForumPost.js";
import ForumComment from "../models/ForumComment.js";

const router = express.Router();

/* helper: generate random anonymous name */
function generateAnonName() {
  const animals = ["Panda", "Tiger", "Dolphin", "Owl", "Fox", "Rabbit", "Koala", "Cat"];
  const moods = ["Calm", "Brave", "Kind", "Strong", "Hopeful", "Gentle", "Happy", "Quiet"];
  const a = animals[Math.floor(Math.random() * animals.length)];
  const m = moods[Math.floor(Math.random() * moods.length)];
  return `Anonymous ${m} ${a}`;
}

/* ✅ CREATE POST */
router.post("/posts", auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "title and content are required" });
    }

    const post = await ForumPost.create({
      userId: req.userId,
      anonymousName: generateAnonName(),
      title: title.trim(),
      content: content.trim(),
      tags: Array.isArray(tags) ? tags : [],
    });

    return res.status(201).json({ success: true, message: "Post created", data: post });
  } catch (err) {
    console.error("Create post error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ✅ LIST POSTS (latest first) */
router.get("/posts", auth, async (req, res) => {
  try {
    const { q, tag } = req.query;

    const filter = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }
    if (tag) {
      filter.tags = tag;
    }

    const posts = await ForumPost.find(filter).sort({ createdAt: -1 }).limit(100);

    return res.json({ success: true, data: posts });
  } catch (err) {
    console.error("List posts error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ✅ GET SINGLE POST + COMMENTS */
router.get("/posts/:id", auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const comments = await ForumComment.find({ postId: post._id }).sort({ createdAt: -1 });

    return res.json({ success: true, data: { post, comments } });
  } catch (err) {
    console.error("Get post error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ✅ ADD COMMENT */
router.post("/posts/:id/comments", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: "content is required" });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const comment = await ForumComment.create({
      postId: post._id,
      userId: req.userId,
      anonymousName: generateAnonName(),
      content: content.trim(),
    });

    return res.status(201).json({ success: true, message: "Comment added", data: comment });
  } catch (err) {
    console.error("Add comment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
