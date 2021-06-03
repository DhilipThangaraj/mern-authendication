const express = require("express");
const router = express.Router();

//import auth controllers
const {
  signup,
  signin,
  accountActivation,
  forgotPassword,
  resetPassword,
  googleLogin,
  facebookLogin,
} = require("../controllers/auth");

//import validators
/**
 * @summary - validation before saving into db
 * @param {Function} userSignUpValidator - it will throw/give success message if name,mailid and password matches expected criteria.
 * @param {Function} userSignInValidator - It will throw/give success message if matches the eligibility criteria
 * @param {Function} forgotPasswordValidator - it will check the given mail id is valid or not.
 * @param {Function} resetPasswordValidator - It will check the password length should not be less than 6.
 * @param {Function}  runValidation - It monitors the all validators function and if anyy error gets detected function accordingly.
 * @note - These two above function works correct then only controller executes properly.
 */

const {
  userSignUpValidator,
  userSignInValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");

const { runValidation } = require("../validators");

router.post("/signup", userSignUpValidator, runValidation, signup);
router.post("/account-activation", accountActivation);
router.post("/signin", userSignInValidator, runValidation, signin);

//Forget and reset password route
router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);

router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);

//Google and Facebook
router.post("/google-login", googleLogin);
router.post("/facebook-login", facebookLogin);

module.exports = router;
