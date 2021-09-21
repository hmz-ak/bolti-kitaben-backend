var express = require("express");
const multer = require("multer");
var router = express.Router();
const { Book } = require("../../model/Book");
const validateBook  = require("../../middleware/validateBook");
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

router.get("/",async (req,res)=>{
  const books = await Book.find();
  res.send(books);
})

router.get("/:id",async (req,res)=>{
 

  const books = await Book.findById(req.params.id);
  res.send(books);
})


router.post("/",upload.single("image"),validateBook, async (req, res) => {
  console.log(req.body);
  const book = new Book();
  book.title = req.body.title;
  book.author = req.body.author;
  book.image = req.file.filename;
  book.description = req.body.description;
  book.categories= req.body.categories;
  await book.save();
  res.send("success");
});




module.exports = router;
