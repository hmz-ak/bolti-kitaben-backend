var mongoose = require("mongoose");
var Joi = require("joi");

var chaptersSchema = mongoose.Schema({
  book_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  title: String,
  titleUrdu: String,
  audio: String,
});

//for sign up
function validateChapters(data) {

  var schema = Joi.object({
    book_id: Joi.string(),
    title: Joi.string().required(),
    titleUrdu: Joi.string().required(),
    audio: Joi.string(),
  });
  return schema.validate(data);
}

var Chapter = mongoose.model("Chapter", chaptersSchema);

module.exports.Chapter = Chapter;
module.exports.validateData = validateChapters;
