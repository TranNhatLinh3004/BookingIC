const router = require("express").Router();
const {
  handleRegister,
  handleLogin,
  handleResetPassword,
} = require("../controllers/auth.controller");
const multer = require("multer");
// register;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Thư mục lưu trữ tệp ảnh trên máy chủ
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Đặt tên tệp ảnh để tránh trùng lặp
  },
});

const upload = multer({ storage: storage });

router.post("/register", handleRegister);

//login
router.post("/login", handleLogin);

router.post("/forgot-password", handleResetPassword);

module.exports = router;
