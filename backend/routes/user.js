const router = require("express").Router();

const {
  handleGetUser,
  handleUpdateUser,
  handleGetAllUsers,
  handleDeleteUser,
} = require("../controllers/user.controller");

//get
router.get("/:id", handleGetUser);

//update
router.put("/:id", handleUpdateUser);

router.get("/", handleGetAllUsers);

// //delete
router.delete("/:id", handleDeleteUser);

module.exports = router;
