  var express = require("express");
var { Category } = require("../../model/Category");
var validateCategory = require("../../middleware/validateCategory");
const auth  = require("../../middleware/auth");

var router = express.Router();

router.get("/", async (req, res) => {
  let categories = await Category.find();
  res.send(categories);
});

router.post("/",auth, validateCategory, async (req, res) => {
  console.log(req.body.name);
  let check_existing = await Category.find({name:req.body.name.toLowerCase()});
  if(check_existing.length>0){
    return res.status(400).send("this category already exist");
  }
  
  let category = new Category();
  category.name = req.body.name.toLowerCase();
  await category.save();
  res.send(category);
});

router.put("/:id",auth, validateCategory, async (req, res) => {
  console.log(req.body);
  let check_existing = await Category.find({name:req.body.name.toLowerCase()});
  if(check_existing.length>0){
    return res.status(400).send("this category already exist");
  }
  let category = await Category.findById(req.params.id);
  category.name = req.body.name.toLowerCase();
  await category.save();

  res.send(category);
});

router.delete("/:id",auth, async (req, res) => {
  let category = await Category.findByIdAndRemove(req.params.id);
  res.send(category);
});

module.exports = router;
