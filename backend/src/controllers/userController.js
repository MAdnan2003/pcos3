import User from "../models/User.js";

/**
 * =========================
 * ADMIN: GET ALL USERS
 * =========================
 * Query params:
 *  - search (optional)
 */
export const getUsers = async (req, res) => {
  try {
    const search = req.query.search || "";

    const query = search.trim()
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const users = await User.find(query).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * =========================
 * ADMIN: SUSPEND / UNSUSPEND USER
 * =========================
 */
export const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = user.status === "active" ? "suspended" : "active";
    await user.save();

    res.json({
      message:
        user.status === "suspended"
          ? "User suspended"
          : "User unsuspended",
      status: user.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * =========================
 * ADMIN: DELETE USER
 * =========================
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
