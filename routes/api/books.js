var express = require("express");
const multer = require("multer");
var router = express.Router();
const { Book } = require("../../model/Book");
const validateBook  = require("../../middleware/validateBook");
const auth  = require("../../middleware/auth");
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

router.get("/",auth,async (req,res)=>{
  const books = await Book.find();
  res.send(books);
})

//Show all the stories specific to person
router.get("/myaudiobooks", auth, async (req, res) => {
  var book = await Book.find({ user_id: req.user._id }).sort({
    date: "desc",
  });
  console.log(book);
  if (book.length == 0) {
    book = null;
  }
  var user = req.user;
  res.send(book);
});


router.get("/:id",auth,async (req,res)=>{
 

  const books = await Book.findById(req.params.id);
  res.send(books);
})


router.post("/",auth,upload.single("image"),validateBook, async (req, res) => {
  console.log(req.body);
  const book = new Book();
  book.user_id = req.user._id;
  book.title = req.body.title;
  book.titleUrdu = req.body.titleUrdu;
  book.narrator = req.body.narrator;
  book.contributor = req.body.contributor;
  book.author = req.body.author;
  if(req.user.role === 'admin'){
    book.approved = true;
  }else{
    book.approved = false;
  }
  if(req.file){
    
  book.image = req.file.filename;

  }
  book.description = req.body.description;
  book.categories= req.body.categories;
  book.subCategory= req.body.subCategory;
  book.genre= req.body.genre;
  await book.save();
  res.send(book);
});


router.put('/approve/:id',auth,async (req,res)=>{
  const book = await Book.findById(req.params.id);
  book.approved = true;
  await book.save();
  res.send(book);
})
router.put("/:id",auth,upload.single("image"),validateBook, async (req, res) => {
  console.log(req.body);
  const book = await Book.findById(req.params.id);
  book.title = req.body.title;
  book.narrator = req.body.narrator;
  book.contributor = req.body.contributor;
  book.titleUrdu = req.body.titleUrdu;
  book.author = req.body.author;
  if(req.file){
  book.image = req.file.filename;
  }
  book.description = req.body.description;
  book.categories= req.body.categories;
  book.subCategory= req.body.subCategory;
  book.genre= req.body.genre;
  await book.save();
  res.send("success");
});

router.delete("/:id",auth, async (req, res) => {
  let book = await Book.findByIdAndRemove(req.params.id);
  res.send(book);
});




module.exports = router;
