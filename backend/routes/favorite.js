const router = require("express").Router();
const {
  addFavorite,
  getFavorites,
  deleteFavorite,
} = require("../controllers/favorite.controller.js");

//CREATE
router.post("/add", addFavorite);

router.get("/:userId", getFavorites);

router.delete("/:id", deleteFavorite);

module.exports = router;
