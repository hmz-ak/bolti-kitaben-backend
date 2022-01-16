  var express = require("express");
var { SubCategory } = require("../../model/SubCategory");
var validateSubCategory = require("../../middleware/validateSubCategory");
const auth  = require("../../middleware/auth");

var router = express.Router();

router.get("/",auth, async (req, res) => {
  let subCategories = await SubCategory.find();
  res.send(subCategories);
});
router.post("/parent",auth, async (req, res) => {
  console.log(req.body.parent)
  let subCategories = await SubCategory.find({parent:req.body.parent});
  console.log(subCategories);
  res.send(subCategories);
});

router.post("/",auth,validateSubCategory, async (req, res) => {
  console.log(req.body.name);
  let check_existing = await SubCategory.find({name:req.body.name.toLowerCase()});
  if(check_existing.length>0){
    return res.status(400).send("this sub-category already exist");
  }
  let subCategories = new SubCategory();
  subCategories.parent = req.body.parent;
  subCategories.name = req.body.name.toLowerCase();
  await subCategories.save();
  res.send(subCategories);
});

router.put("/:id",auth,validateSubCategory, async (req, res) => {
  console.log(req.body);
  let check_existing = await SubCategory.find({name:req.body.name.toLowerCase()});
  if(check_existing.length>0){
    return res.status(400).send("this sub-category already exist");
  }
  let subCategory = await SubCategory.findById(req.params.id);
  subCategory.name = req.body.name.toLowerCase();
  await subCategory.save();

  res.send(subCategory);
});

router.delete("/:id",auth, async (req, res) => {
  let subCategory = await SubCategory.findByIdAndRemove(req.params.id);
  res.send(subCategory);
});

module.exports = router;
