const express = require("express");
const router = express.Router();

//import signup controller
const { signup } = require("../controllers/auth");

router.get("/signup", signup);

module.exports = router;
