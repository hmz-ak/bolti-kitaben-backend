var mongoose = require("mongoose");
var Joi = require("joi");

var booksSchema = mongoose.Schema({
  title: String,
  titleUrdu: {
    type: String,
    default: ""
  },
  author: String,
  categories: String,
  subCategory: String,
  genre: [],
  description: String,
  image: String,
});

//for sign up
function validateBooks(data) {

  var schema = Joi.object({
    title: Joi.string().required(),
    titleUrdu: Joi.optional(),
    author: Joi.string().required(),
    categories: Joi.string().required(),
    subCategory: Joi.string().required(),
    genre: Joi.required(),
    description: Joi.string().required(),
    image: Joi.string(),
  });
  return schema.validate(data);
}

var Book = mongoose.model("Book", booksSchema);

module.exports.Book = Book;
module.exports.validateData = validateBooks;
