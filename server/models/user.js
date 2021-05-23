const mongoose = require("mongoose");
const crypto = require("crypto");
const { match } = require("assert");

// user schema

/**
 * @summary signup form - moongoose schema helps to generate user schema.
 * @param  {property} name - necessary validation should be done such as [type,trim, required and max].
 * @param  {property} email - necessary validation should be done.
 * @param  {property} hashed_password - Takes the normal password and converts to hashed one.
 * @param  {property} salt - Helps to make strong number which provides numbers and that helps to be used in the cypto
 * encryption cycle.
 * @param  {property} role - Signup form has the two different role and by default subscriber role will be taken.
 * @param  {property} resetPasswordLink - Reset the password.
 * @param {property} timeStamps(true) -  If we use this property , whenever schema gets updated and created timestamp will be created which helps a lot.
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "subscriber",
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  { timestamps: true }
);

// virtual

/**
 * @summary This piece of code takes the plain password and converts to hashed password for security purpose.(userSchema virtual and methods)
 * @param {Function} userSchema.virtual - when executed when new password has submitted from the signup form.
 * @returns {hashed password} - will be converted hashed password.
 * @param {Function} encryptPassword - By using node core module of crypto which generated high security password.
 * @returns {encrypted pwd} - number of crypto cycle involved and with sha256 algoithm.
 * @param {Function} makeSalt - Helps to make the strong password strength and it would be number that gives to the encyption cycle in the crypto module.
 * @returns {number}
 * @param {property} this._password -  _password property only intact to the set function.
 * @param {Function} authendicate - When old user enters the password this function called and check the exsisting password in the db or not.
 * @returns {Boolean}
 */

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods

userSchema.methods = {
  authendicate: function (plainPassword) {
    return this.encryptPassword(plainPassword) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random() + "");
  },
};

module.exports = mongoose.model("User", userSchema);
