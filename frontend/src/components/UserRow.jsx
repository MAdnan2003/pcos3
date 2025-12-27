import axios from "axios";

export default function UserRow({ user, refresh }) {
  const token = localStorage.getItem("token");

  const toggleSuspend = async () => {
    await axios.patch(
      `http://localhost:5000/api/users/${user._id}/suspend`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    refresh();
  };

  const remove = async () => {
    await axios.delete(
      `http://localhost:5000/api/users/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    refresh();
  };

  return (
    <tr className="border-b">
      <td className="py-4">{user.name}</td>
      <td>{user.email}</td>

      <td>
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            user.status === "active"
              ? "bg-pink-100 text-pink-600"
              : "bg-red-500 text-white"
          }`}
        >
          {user.status}
        </span>
      </td>

      <td>{new Date(user.joinDate).toISOString().split("T")[0]}</td>
      <td>{user.posts}</td>

      <td className="text-right">
        <button
          onClick={toggleSuspend}
          className={`mr-2 px-3 py-1 rounded-lg ${
            user.status === "active"
              ? "bg-yellow-500"
              : "bg-green-500"
          } text-white`}
        >
          {user.status === "active" ? "Suspend" : "Unsuspend"}
        </button>

        <button
          onClick={remove}
          className="px-3 py-1 bg-red-500 text-white rounded-lg"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
