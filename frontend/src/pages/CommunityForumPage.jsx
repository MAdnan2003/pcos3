import React, { useEffect, useState } from "react";
import { createPost, listPosts } from "../api/forumApi";
import { useNavigate } from "react-router-dom";

export default function CommunityForumPage() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [posts, setPosts] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsText, setTagsText] = useState("");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    const { status, result } = await listPosts({ q });
    if (status === 200 && result.success) setPosts(result.data);
    else setErr(result.message || "Failed to load posts");
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setMsg(""); setErr("");

    if (!title.trim() || !content.trim()) {
      setErr("Title and content are required.");
      return;
    }

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 8);

    setLoading(true);
    const { status, result } = await createPost({ title, content, tags });
    setLoading(false);

    if (status === 201 && result.success) {
      setMsg("✅ Post shared anonymously");
      setTitle(""); setContent(""); setTagsText("");
      load();
    } else {
      setErr(result.message || "Failed to create post");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Community Forum
          </h1>
          <p className="text-gray-600 mt-1">
            Share experiences, tips, and support — anonymously.
          </p>
        </div>

        {msg && <div className="p-3 rounded-lg bg-green-100 text-green-700">{msg}</div>}
        {err && <div className="p-3 rounded-lg bg-red-100 text-red-700">{err}</div>}

        {/* Create post */}
        <form onSubmit={onCreate} className="bg-white p-6 rounded-2xl shadow-lg border border-pink-200/60 space-y-3">
          <h2 className="text-xl font-semibold text-gray-800">Create Anonymous Post</h2>

          <input
            className="w-full px-4 py-2 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />

          <textarea
            className="w-full px-4 py-2 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Write your experience / tips (required)"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
          />

          <input
            className="w-full px-4 py-2 rounded-xl border border-pink-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Tags (optional) e.g. acne, diet, anxiety (comma separated)"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
          >
            {loading ? "Posting..." : "Share Anonymously"}
          </button>
        </form>

        {/* Search */}
        <div className="bg-white p-5 rounded-2xl shadow-lg border border-pink-200/60 flex items-center justify-between gap-4">
          <input
            className="w-full px-4 py-2 rounded-xl border border-pink-300 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Search posts..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            onClick={load}
            className="px-4 py-2 rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition"
          >
            Search
          </button>
        </div>

        {/* Post list */}
        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="text-gray-500">No posts yet. Be the first to share 💜</div>
          ) : (
            posts.map((p) => (
              <button
                key={p._id}
                onClick={() => navigate(`/forum/${p._id}`)}
                className="w-full text-left p-5 rounded-2xl border border-pink-100 bg-pink-50/40 hover:bg-pink-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-900">{p.title}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {p.anonymousName} • {p.content.slice(0, 140)}
                  {p.content.length > 140 ? "..." : ""}
                </div>
                {p.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
