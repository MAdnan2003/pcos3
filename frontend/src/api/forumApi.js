const BASE_URL = "http://localhost:5000/api/forum";

function getToken() {
  return localStorage.getItem("token");
}

export async function listPosts({ q = "", tag = "" } = {}) {
  const token = getToken();
  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (tag) params.append("tag", tag);

  const res = await fetch(`${BASE_URL}/posts?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  return { status: res.status, result };
}

export async function createPost(payload) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const result = await res.json();
  return { status: res.status, result };
}

export async function getPost(postId) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  return { status: res.status, result };
}

export async function addComment(postId, payload) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const result = await res.json();
  return { status: res.status, result };
}
