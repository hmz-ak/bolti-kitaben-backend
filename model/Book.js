var mongoose = require("mongoose");
var Joi = require("joi");

var booksSchema = mongoose.Schema({
  title: String,
  titleUrdu: {
    type: String,
    default: ""
  },
  narrator:String,
  contributor:String,
  approved:Boolean,
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
    narrator: Joi.optional(),
    contributor: Joi.optional(),
    author: Joi.string().required(),
    categories: Joi.optional(),
    subCategory: Joi.optional(),
    genre: Joi.optional(),
    description: Joi.string().required(),
    image: Joi.optional(),
  });
  return schema.validate(data);
}

var Book = mongoose.model("Book", booksSchema);

module.exports.Book = Book;
module.exports.validateData = validateBooks;
