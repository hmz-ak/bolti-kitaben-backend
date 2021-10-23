var mongoose = require("mongoose");
var Joi = require("joi");

var categorySchema = mongoose.Schema({
  name: String,
});

function validateData(data) {
  var schema = Joi.object({
    name: Joi.string(),
  });
  return schema.validate(data);
}

var Category = mongoose.model("Category", categorySchema);

module.exports.Category = Category;
module.exports.validateData = validateData;
