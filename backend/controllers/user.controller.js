const User = require("../models/user");
// const bcrypt = require("bcrypt");

// get user
const handleGetUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Sử dụng { _id: id } hoặc { _id } để tìm kiếm người dùng
    const user = await User.findOne({ _id: id });

    if (!user) {
      // Kiểm tra xem người dùng có tồn tại không
      return res.status(404).json({ message: "User not found" });
    }

    const { ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const handleUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { newUsername, newEmail, newPhone, newAddress, newAvatar } = req.body; // Assuming you send the updated data in the request body

    // Find the user by username and update their data
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      {
        avatar: newAvatar,
        username: newUsername,
        email: newEmail,
        phone: newPhone,
        address: newAddress,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...other } = updatedUser._doc; // Exclude password from response
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get all users
const handleGetAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const handleDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);

    if (!deleteUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  handleGetUser,
  handleUpdateUser,
  handleGetAllUsers,
  handleDeleteUser,
};
