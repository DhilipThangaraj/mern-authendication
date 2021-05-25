const express = require("express");
const router = express.Router();

//import signup controller
const { signup } = require("../controllers/auth");
//Import account activation controller
const { accountActivation } = require("../controllers/auth");

//import validators
/**
 * @summary - validation before saving into db
 * @param {Function} userSignUpValidator - it will throw/give success message if name,mailid and password matches expected criteria.
 * @param {Function}  runValidation - It monitors the all validators function and if anyy error gets detected function accordingly.
 * @note - These two above function works correct then only controller executes properly.
 */
const { userSignUpValidator } = require("../validators/auth");
const { runValidation } = require("../validators");

router.post("/signup", userSignUpValidator, runValidation, signup);
router.post("/account-activation", accountActivation);

module.exports = router;
