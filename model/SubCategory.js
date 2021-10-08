var mongoose = require("mongoose");
var Joi = require("joi");

var subCategorySchema = mongoose.Schema({
  parent: String,
  name: String,
});

function validateData(data) {
  var schema = Joi.object({
    parent: Joi.string().required(),
    name: Joi.string().required(),
  });
  return schema.validate(data);
}

var SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports.SubCategory = SubCategory;
module.exports.validateData = validateData;
