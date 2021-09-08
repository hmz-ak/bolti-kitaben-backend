var express = require("express");
var { Category } = require("../../model/Category");

var router = express.Router();

router.get("/", async (req, res) => {
  let categories = await Category.find();
  res.send(categories);
});

router.post("/", async (req, res) => {
  let category = new Category();
  category.name = req.body.name;
  await category.save();
  res.send(category);
});

module.exports = router;
