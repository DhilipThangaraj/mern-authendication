const User = require("../models/user");

const jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

//node mailer
const nodemailer = require("nodemailer");
const user = require("../models/user");

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
 *@summary extract the user details from jwt token and stores it in db.
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
