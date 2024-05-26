const router = require("express").Router();

const { searchHandle } = require("../controllers/search.controller");

//update
router.get("/", searchHandle);

// //delete
// router.delete("/:id", handleDeleteUser);

module.exports = router;
