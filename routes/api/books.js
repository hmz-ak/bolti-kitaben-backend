var express = require("express");
const multer = require("multer");
var router = express.Router();
const { Book } = require("../../model/Book");
//define storage for images

const storage = multer.diskStorage({
  //destination for files
  destination: function (request, file, callback) {
    callback(null, "./public/images");
  },

  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

//upload parameters for multer

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 10,
  },
});
router.post("/", upload.single("image"), async (req, res) => {
  const book = new Book();
  book.title = req.body.title;
  book.author = req.body.author;
  book.image = req.file.path;
  book.description = req.body.description;
  book.category = req.body.categories;
  await book.save();
  res.send("success");
});

module.exports = router;
