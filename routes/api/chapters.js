var express = require("express");
const multer = require("multer");
var router = express.Router();
const { Chapter } = require("../../model/Chapter");
const validateChapter  = require("../../middleware/validateChapter");
//define storage for images

const storage = multer.diskStorage({
  //destination for files
  destination: function (request, file, callback) {
    callback(null, "./public/audios");
  },

  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

//upload parameters for multer

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 100,
  },
});

// router.get("/",async (req,res)=>{
//   const chapters = await Book.find();
//   res.send(books);
// })


router.get("/single/:id",async (req,res)=>{

  const chapter = await Chapter.findById(req.params.id);
  // console.log(chapter)

  res.send(chapter);
})
router.get("/:id",async (req,res)=>{
  
  const chapter = await Chapter.find({book_id:req.params.id});
  console.log(chapter)

  res.send(chapter);
})


router.post("/",upload.single("audio"),validateChapter, async (req, res) => {
  console.log(req.body);

  const chapter = new Chapter();
  chapter.book_id = req.body.book_id;
  chapter.title = req.body.title;
  chapter.titleUrdu = req.body.titleUrdu;
  chapter.audio = req.file.filename;
  
  await chapter.save();
  res.send(chapter);
});

// router.put("/:id",upload.single("image"),validateBook, async (req, res) => {
//   console.log(req.body);
//   const book = await Book.findById(req.params.id);
//   book.title = req.body.title;
//   book.titleUrdu = req.body.titleUrdu;
//   book.author = req.body.author;
//   if(req.file){
//   book.image = req.file.filename;
//   }
//   book.description = req.body.description;
//   book.categories= req.body.categories;
//   book.subCategory= req.body.subCategory;
//   book.genre= req.body.genre;
//   await book.save();
//   res.send("success");
// });




module.exports = router;
