const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
  res.json({
    data: "Hey there, You hit a signup endpoint.",
  });
});

module.exports = router;
