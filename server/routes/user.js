const express = require("express");
const router = express.Router();

//import controller
const { read } = require("../controllers/user");
const { update } = require("../controllers/user");

//Import api protecting function
const { requireSignin, adminMiddleware } = require("../controllers/auth");

//Role - subscriber
router.get("/user/:id", requireSignin, read);
router.put("/user/update", requireSignin, update);

//Role - admin
router.put("/admin/update", requireSignin, adminMiddleware, update);

module.exports = router;
