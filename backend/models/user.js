const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      // default: "",
    },
    resetPasswordToken: {
      type: String,
      // default: "",
    },
    resetPasswordExpires: {
      type: Date,
      // default: "",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: Number,
      // You can set additional properties for the phone field, like required, unique, etc.
    },
    address: { type: String, default: "Việt Nam" },

    user_type: {
      type: String, //lease. user, admin
      default: "user",
    },

    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Favorite" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
