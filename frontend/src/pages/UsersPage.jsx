import { useEffect, useState } from "react";
import axios from "axios";
import UserRow from "../components/UserRow";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token missing. Please log in again.");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/users?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ REQUIRED
          },
        }
      );

      // Backend may return users directly or wrapped
      setUsers(res.data.users || res.data);
      setError("");
    } catch (err) {
      console.error("Fetch users error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Failed to load users. Unauthorized or server error."
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  return (
    <div className="min-h-screen p-8 space-y-10 bg-white">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        User Management
      </h1>
      <p className="text-gray-600 mb-8">
        Manage and monitor all platform users
      </p>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-200/60">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              All Users
            </h2>
            <p className="text-sm text-gray-500">
              A list of all registered users
            </p>
          </div>

          <input
            type="text"
            placeholder="Search users..."
            className="w-72 px-4 py-2 rounded-xl border border-pink-300 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-pink-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-pink-50 text-gray-600 border-b border-pink-100">
                <th className="py-3 px-4">Name</th>
                <th className="px-4">Email</th>
                <th className="px-4">Status</th>
                <th className="px-4">Join Date</th>
                <th className="px-4">Posts</th>
                <th className="px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <UserRow
                    key={user._id}
                    user={user}
                    refresh={fetchUsers}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
