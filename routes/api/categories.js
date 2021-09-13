var express = require("express");
var { Category } = require("../../model/Category");
var validateCategory = require("../../middleware/validateCategory");

var router = express.Router();

router.get("/", async (req, res) => {
  let categories = await Category.find();
  res.send(categories);
});

router.post("/", validateCategory, async (req, res) => {
  console.log(req.body.category);
  let category = new Category();
  category.name = req.body.category;
  await category.save();
  res.send(category);
});

module.exports = router;
