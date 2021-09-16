var mongoose = require("mongoose");
var Joi = require("joi");
var bcrypt = require("bcryptjs");

var booksSchema = mongoose.Schema({
  title: String,
  author: String,
  category: [],
  description: String,
  image: String,
});

//for sign up
function validateBooks(data) {
  var schema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    category: Joi.array().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
  });
  return schema.validate(data);
}

var Book = mongoose.model("Book", booksSchema);

module.exports.Book = Book;
module.exports.validateBook = validateBook;
