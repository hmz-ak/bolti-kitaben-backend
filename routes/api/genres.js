  var express = require("express");
var { Genre } = require("../../model/Genre");
var validateGenre = require("../../middleware/validateGenre");
const auth  = require("../../middleware/auth");

var router = express.Router();

router.get("/",auth, async (req, res) => {
  let grenres = await Genre.find();
  res.send(grenres);
});

router.get("/names",auth, async (req, res) => {
  let grenres = await Genre.find({}, 'name -_id');
  res.send(grenres);
});

router.post("/",auth,validateGenre, async (req, res) => {
  let check_existing = await Genre.find({name:req.body.name.toLowerCase()});
  if(check_existing.length>0){
    return res.status(400).send("this genre already exist");
  }
  let genre = new Genre();
  genre.name = req.body.name;
  await genre.save();
  res.send(genre);
});

router.put("/:id",auth,validateGenre, async (req, res) => {
  console.log(req.body);
  let check_existing = await Genre.find({name:req.body.name.toLowerCase()});
  if(check_existing.length>0){
    return res.status(400).send("this genre already exist");
  }
  let genre = await Genre.findById(req.params.id);
  genre.name = req.body.name;
  await genre.save();

  res.send(genre);
});

router.delete("/:id",auth, async (req, res) => {
  let genre = await Genre.findByIdAndRemove(req.params.id);
  res.send(genre);
});

module.exports = router;
