var mongoose = require("mongoose");
var Joi = require("joi");

var chaptersSchema = mongoose.Schema({
  book_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  user_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  previous_chapter: [],
  next_chapter: [],
  
  title: String,
  approved:Boolean,
  titleUrdu: String,
  tags: [],
  audio: String,

});

//for sign up
function validateChapters(data) {

  var schema = Joi.object({
    book_id: Joi.string(),
    user_id:Joi.optional(),
    previous_chapter: Joi.optional(),
    next_chapter: Joi.optional(),
    title: Joi.string().required(),
    titleUrdu: Joi.optional(),
    tags:Joi.optional(),
    audio: Joi.string(),
  });
  return schema.validate(data);
}

var Chapter = mongoose.model("Chapter", chaptersSchema);

module.exports.Chapter = Chapter;
module.exports.validateData = validateChapters;
