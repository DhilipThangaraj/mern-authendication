const User = require("../models/user");

const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const _ = require("lodash");

//node mailer
const nodemailer = require("nodemailer");

/**
 * @summary Save the brand new user's name, email and password in db.
 * @param {*} req - client signup request.
 * @param {*} res - server response.
 * @param {constructor} User - User is a schema/model for signup.
 * @param {Function} findOne - moongoose function which Start finding a user.If it found and stop searching.
 * @param {Function} save - save the users details which intern use the callback.
 */

/**
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
**/

/**
 *
 * @summary Before keeping the user details into the DB. First we should get email activation link in
 * our email then once we get activate the link then user details will be stored in the database by clicking the link
 * that happens in the account-activation controller.
 *
 * @Note - Basically we are running with smtp server to make the email link.
 * @Note - For further clarity refer npm node mailer official documentation.
 */

exports.signup = async (req, res) => {
  //write something
  const { name, email, password } = req.body;

  User.findOne({ email }).exec(async (err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }
    // process.env.JWT_ACCOUNT_ACTIVATION - activation key
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "1d" }
    );

    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // send mail with defined transport object
    transporter.sendMail(
      {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: `${email}`, // list of receivers
        subject: `Account activation link`, // Subject line
        text: "Sign Up ", // plain text body
        html: `
                <h1>Please use the following link to activate your account</h1>
                <a href=${process.env.CLIENT_URL}/auth/activate/${token} target="_blank">Activation Link</a>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
      },
      (err, data) => {
        if (err) {
          return res.json({
            message: "Email has been failed to sent.",
          });
        }
        console.log("Signup success data", data);
        console.log("Message sent: %s", data.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(data));
        return res.json({
          message: `Email has been sent to ${email}. Follow the instruction to activate your account.`,
        });
      }
    );
  });
};

/**
 * @summary extract the user details from jwt token and stores it in db.
 * @param {Object} req - One of the property is jwt token which has name,pwd and email.
 * @param {Object} res
 * @param {Function} jwt.verify - verifies the token signature with jwt_account_activation signature.
 * @returns - json object with error code depends on the condition.
 */

exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACCOUNT_ACTIVATION,
      function (err, decode) {
        if (err) {
          console.log("JWT VERIFY IN ACCOUNT ACTIVATION ERROR", err);
          return res.status(401).json({
            error: "Expired link and Signup again",
          });
        }

        const { name, email, password } = jwt.decode(token);
        const user = new User({ name, email, password });

        user.save((err, user) => {
          if (err) {
            console.log("SAVE USER IN ACCOUNT ACTIVATION ERROR", err);
            return res.status(401).json({
              error: "Error saving in database.Try signup again",
            });
          }

          return res.json({
            message: "Signup success and Please sign in!!!",
          });
        });
      }
    );
  } else {
    return res.json({
      message: "Something went wrong. Try again",
    });
  }
};

/**
 * @summary - signin
 * @param {Function} User.findOne - Which finds the exact email id in the db.
 * @param {Function} user.authenticate - this function belongs to user's schema which compares the plain pwd to
 * hashed pwd which saved in the data base.
 * @param {property} user._id - This is the moongose id generated by default to each document.
 * @returns {Object} json response with   token, user: { _id, name, email, role }
 */

exports.signin = (req, res) => {
  const { email, password } = req.body;
  //Check if user is exsist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email address does not exsist.Please signup!",
      });
    }

    //If he is a user has proper email id check the password is valid or not.
    if (!user.authendicate(password)) {
      return res.status(400).json({
        error: "Email with associated password does not match.",
      });
    }

    //generate a token and send to the client.
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SIGNIN_SECRET, {
      expiresIn: "7d",
    });

    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

/**
 * @summary - This is for protecting api route which checks the token has the valid secret.
 * @Note - This function if we apply in the route you will get the user id as req.user.id in th controller call
 * @returns {Object} user info
 * @Note - This middleware protects the authendic user (subscriber).
 */

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SIGNIN_SECRET,
  algorithms: ["HS256"],
});

/**
 * @summary - This middleware protects the authendic user who has role of admin.
 */

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource.Access denied",
      });
    }

    req.profile = user;
    next();
  });
};

/**
 * @summary - Basically gets the email id from the user to reset the pwd.
 * @param {Function} forgotPassword - This function send the id wrapped token to users.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns - send the email to reset the password.
 */

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email }, async (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with the email does not exsist",
      });
    }

    // process.env.JWT_ACCOUNT_ACTIVATION - activation key
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m",
    });

    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // send mail with defined transport object
    transporter.sendMail(
      {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: `${email}`, // list of receivers
        subject: `Password reset link`, // Subject line
        text: "Sign Up ", // plain text body
        html: `
                <h1>Please use the following link to reset your password</h1>
                <a href=${process.env.CLIENT_URL}/auth/password/reset/${token} target="_blank">Activation Link</a>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
      },
      (err, data) => {
        if (err) {
          return res.json({
            message: "Email has been failed to sent.",
          });
        }
        console.log("reset password data", data);
        console.log("Message sent: %s", data.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(data));

        // Keeping the token with the user model at the resetPasswordLink property before showing email has been sent text.
        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
          if (err) {
            console.log("RESET PASSWORD LINK ERROR", err);
            return res.status(400).json({
              error:
                "Database connection error on user password forgot request",
            });
          } else {
            return res.json({
              message: `Email has been sent to ${email}. Follow the instruction to reset your account.`,
            });
          }
        });
      }
    );
  });
};

/**
 * @summary - Resetting the password.
 * @param {property} resetPasswordLink - token generated during forgot-password.
 * @param {property} newPassword - which is entered from client password to reset.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {Function} _.extend - is the function which extend the object and put some property in it.
 */

exports.resetPassword = (req, res, next) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      function (err, decoded) {
        if (err) {
          return res.status(400).json({
            error: "Expired Link. Try again",
          });
        }

        User.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "Something went wrong.Try later",
            });
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: "Error reseting user password",
              });
            }
            res.json({
              message: "Great!, You can now login with new password",
            });
          });
        });
      }
    );
  }
};
