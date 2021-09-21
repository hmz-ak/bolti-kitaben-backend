  var express = require("express");
var { Genre } = require("../../model/Genre");
var validateGenre = require("../../middleware/validateGenre");

var router = express.Router();

router.get("/", async (req, res) => {
  let grenres = await Genre.find();
  res.send(grenres);
});

router.post("/",validateGenre, async (req, res) => {
  console.log(req.body.name);
  let genre = new Genre();
  genre.name = req.body.name;
  await genre.save();
  res.send(genre);
});

router.put("/:id",validateGenre, async (req, res) => {
  console.log(req.body);
  let genre = await Genre.findById(req.params.id);
  genre.name = req.body.name;
  await genre.save();

  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  let genre = await Genre.findByIdAndRemove(req.params.id);
  res.send(genre);
});

module.exports = router;
