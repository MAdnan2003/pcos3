import { useState } from "react";
import AddUserModal from "./AddUserModal";
import { Link } from "react-router-dom";

export default function QuickActions({ refreshUsers }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AddUserModal 
        open={open} 
        onClose={() => setOpen(false)} 
        onUserAdded={refreshUsers} 
      />

      <div className="bg-white/90 p-6 shadow-md rounded-xl">
        <button
          className="w-full p-2 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500"
          onClick={() => setOpen(true)}
        >
          Add New User
        </button>

        <Link
          to="/users"
          className="block w-full p-2 rounded-lg text-center text-white font-semibold bg-gradient-to-r from-pink-500 to-rose-500"
        >
          Manage Users
        </Link>
      </div>
    </>
  );
}
