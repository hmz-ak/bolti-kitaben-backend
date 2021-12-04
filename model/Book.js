var mongoose = require("mongoose");
var Joi = require("joi");

var booksSchema = mongoose.Schema({
  user_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  title: String,
  titleUrdu: {
    type: String,
    default: ""
  },
  narrator:String,
  contributor:String,
  contributionType:String,
  approved:Boolean,
  disapproved:Boolean,
  disapproval_message:String,
  chapter_approval:Boolean,
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
    user_id:Joi.optional(),
    title: Joi.string().required(),
    titleUrdu: Joi.optional(),
    narrator: Joi.optional(),
    contributor: Joi.optional(),
    contributionType: Joi.optional(),
    disapproval_message:Joi.optional(),
    author: Joi.optional(),
    categories: Joi.optional(),
    subCategory: Joi.optional(),
    genre: Joi.optional(),
    description: Joi.string().required(),
    image: Joi.string(),
  });
  return schema.validate(data);
}

var Book = mongoose.model("Book", booksSchema);

module.exports.Book = Book;
module.exports.validateData = validateBooks;
