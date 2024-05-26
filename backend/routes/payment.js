const router = require("express").Router();

// router.post("/", addProduct);
router.get("/config", (req, res) => {
  res.status(200).json({
    status: "OK",
    data: process.env.CLIENT_IDPAY,
  });
});

module.exports = router;
