import React, { useEffect, useState } from "react";
import { addComment, getPost } from "../api/forumApi";
import { useNavigate, useParams } from "react-router-dom";

export default function ForumPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [commentText, setCommentText] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    const { status, result } = await getPost(id);
    if (status === 200 && result.success) {
      setPost(result.data.post);
      setComments(result.data.comments);
    } else {
      setErr(result.message || "Failed to load post");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  const onAdd = async (e) => {
    e.preventDefault();
    setMsg(""); setErr("");

    if (!commentText.trim()) {
      setErr("Comment cannot be empty.");
      return;
    }

    setLoading(true);
    const { status, result } = await addComment(id, { content: commentText });
    setLoading(false);

    if (status === 201 && result.success) {
      setMsg("✅ Comment added");
      setCommentText("");
      load();
    } else {
      setErr(result.message || "Failed to add comment");
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen p-6 bg-white">
        <div className="max-w-3xl mx-auto">{err || "Loading..."}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate("/forum")}
          className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          ← Back to Forum
        </button>

        {msg && <div className="p-3 rounded-lg bg-green-100 text-green-700">{msg}</div>}
        {err && <div className="p-3 rounded-lg bg-red-100 text-red-700">{err}</div>}

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-200/60">
          <div className="text-xs text-gray-500 mb-2">
            {post.anonymousName} • {new Date(post.createdAt).toLocaleString()}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
          <p className="text-gray-700 mt-3 whitespace-pre-wrap">{post.content}</p>

          {post.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={onAdd} className="bg-white p-6 rounded-2xl shadow-lg border border-pink-200/60 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">Add Anonymous Comment</h2>
          <textarea
            className="w-full px-4 py-2 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            rows={4}
            placeholder="Write a supportive comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            maxLength={1000}
          />
          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Comments</h3>
          {comments.length === 0 ? (
            <div className="text-gray-500">No comments yet.</div>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="p-4 rounded-2xl border border-pink-100 bg-pink-50/30">
                <div className="text-xs text-gray-500">
                  {c.anonymousName} • {new Date(c.createdAt).toLocaleString()}
                </div>
                <div className="text-gray-700 mt-1 whitespace-pre-wrap">{c.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
