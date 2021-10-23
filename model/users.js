var mongoose = require("mongoose");
var Joi = require("joi");
var bcrypt = require("bcryptjs");

var userSchema = mongoose.Schema({
  first_name: String,
  last_name:String,
  email: String,
  password: String,
  authType : {
    type:String,
    default: "Manual"
  },
  role: {
    type: String,
    default: "user",
  },
});

userSchema.methods.generatePasswordHash = async function () {
  var salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};
//for sign up
function validateUser(data) {
  var schema = Joi.object({
    first_name: Joi.string().min(3).max(12).required(),
    last_name: Joi.string().min(3).max(12).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(10).required(),
  });
  return schema.validate(data);
}

function validateUserLogin() {
  var schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(10).required(),
  });
  return schema.validate(data);
}

var User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validateUserLogin = validateUserLogin;
