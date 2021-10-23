var mongoose = require("mongoose");
var Joi = require("joi");

var genreSchema = mongoose.Schema({
  name: String,
});

function validateData(data) {
  var schema = Joi.object({
    name: Joi.string(),
  });
  return schema.validate(data);
}

var Genre = mongoose.model("Genre", genreSchema);

module.exports.Genre = Genre;
module.exports.validateData = validateData;
