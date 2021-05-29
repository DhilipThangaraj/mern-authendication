const express = require("express");
const router = express.Router();

//import controller
const { read } = require("../controllers/user");

//Import api protecting function
const { requireSignin } = require("../controllers/auth");

router.get("/user/:id", requireSignin, read);

module.exports = router;
