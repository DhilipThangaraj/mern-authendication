const User = require("../models/user");

/**
 * @summary Save the brand new user's name, email and password in db.
 * @param {*} req - client signup request.
 * @param {*} res - server response.
 * @param {constructor} User - User is a schema/model for signup.
 * @param {Function} findOne - moongoose function which Start finding a user.If it found and stop searching.
 * @param {Function} save - save the users details which intern use the callback to support the process.
 */

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
  });

  let newUser = new User({ name, email, password });

  newUser.save((err, success) => {
    if (err) {
      console.log("SIGNUP ERROR", err);
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "Signup success! Please signin",
    });
  });
};
