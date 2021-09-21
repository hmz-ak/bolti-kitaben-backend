  var express = require("express");
var { SubCategory } = require("../../model/SubCategory");
var validateSubCategory = require("../../middleware/validateSubCategory");

var router = express.Router();

router.get("/", async (req, res) => {
  let subCategories = await SubCategory.find();
  res.send(subCategories);
});

router.post("/",validateSubCategory, async (req, res) => {
  console.log(req.body.name);
  let subCategories = new SubCategory();
  subCategories.name = req.body.name;
  await subCategories.save();
  res.send(subCategories);
});

router.put("/:id",validateSubCategory, async (req, res) => {
  console.log(req.body);
  let subCategory = await SubCategory.findById(req.params.id);
  subCategory.name = req.body.name;
  await subCategory.save();

  res.send(subCategory);
});

router.delete("/:id", async (req, res) => {
  let subCategory = await SubCategory.findByIdAndRemove(req.params.id);
  res.send(subCategory);
});

module.exports = router;
