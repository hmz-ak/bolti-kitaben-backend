var express = require("express");
const multer = require("multer");
var router = express.Router();
const { Chapter } = require("../../model/Chapter");
// const { Book } = require("../../model/Book");

const validateChapter  = require("../../middleware/validateChapter");
const auth  = require("../../middleware/auth");
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
    fieldSize: 1024 * 1024 * 1000000,
  },
});

// router.get("/",async (req,res)=>{
//   const chapters = await Book.find();
//   res.send(books);
// })

router.get("/",auth,async (req,res)=>{

  const chapter = await Chapter.find({approved:false});
  

  res.send(chapter);
})


router.get("/single/:id",auth,async (req,res)=>{

  const chapter = await Chapter.findById(req.params.id);
  // console.log(chapter)

  res.send(chapter);
})
router.get("/:id",auth,async (req,res)=>{
  //task todo : match logged in user id with user_id to get unapproved chapters too

  let chapter = await Chapter.find({book_id:req.params.id,approved:true});
  let getUser ="";
  if(chapter.length != 0){
     getUser = chapter[0].user_id;
  }
  if(getUser !== ""){
    if(JSON.stringify(getUser[0]) == JSON.stringify(req.user._id)){
      chapter = await Chapter.find({book_id:req.params.id});
      console.log("yoo",chapter)
      }
      else {
         chapter = await Chapter.find({book_id:req.params.id});
        console.log("reached here");
        console.log(req.params.id);
        }
  }else {
    chapter = await Chapter.find({book_id:req.params.id});
    console.log("reached here");
    
    }
  

  if(chapter.length >1){
    for(var i=0;i<chapter.length-1;i++){
      if(i == 0){
        chapter[i].previous_chapter = [];
        chapter[i].next_chapter = chapter[i+1]._id;
        await chapter[i].save();
      }else{
        chapter[i].previous_chapter = chapter[i-1]._id;
        chapter[i].next_chapter = chapter[i+1]._id;
        await chapter[i].save();
  
      }
  }
  chapter[chapter.length-1].next_chapter=[];
  chapter[chapter.length-1].previous_chapter=chapter[chapter.length-2]._id;
  await chapter[chapter.length-1].save();

  }
  

  // console.log("these are chapters",chapter);
  console.log("chapter found",chapter)
  res.send(chapter);
})


router.post("/",auth,upload.single("audio"),validateChapter, async (req, res) => {
  // const books = await Book.findById(req.body.book_id);
  // console.log("added new",books);
  const getLastChapter = await Chapter.find({book_id:req.body.book_id}).sort({_id: -1}).limit(1);
  console.log("chap");
 
 
  const chapter = new Chapter();
  if(getLastChapter.length == 0){
    chapter.next_chapter=[];
    chapter.previous_chapter=[];
  }else{
    chapter.previous_chapter = getLastChapter[0]._id;
    getLastChapter[0].next_chapter = chapter._id;
    chapter.next_chapter=[];
    await getLastChapter[0].save();
  }
  chapter.user_id = req.user._id;
  chapter.book_id = req.body.book_id;
  chapter.title = req.body.title;
  if(req.user.role === 'admin'){
    chapter.approved = true;
    // books.approved=true;
  }else{
    chapter.approved = false;
    // books.approved=false;
  }
  
  chapter.tags = req.body.tags;
  chapter.titleUrdu = req.body.titleUrdu;
  chapter.audio = req.file.filename;
  
  await chapter.save();
 
  res.send(chapter);
});



router.put('/approve/:id',auth,async (req,res)=>{
  const chapter = await Chapter.findById(req.params.id);
  chapter.approved = true;
  await chapter.save();
  res.send(chapter);
})
router.delete("/:id",auth, async (req, res) => {
  let chapter = await Chapter.findByIdAndRemove(req.params.id);
  res.send(chapter);
});


router.put("/:id",auth,upload.single("audio"),validateChapter, async (req, res) => {
  console.log(req.body);
  const chapter = await Chapter.findById(req.params.id);
  chapter.title = req.body.title;
  chapter.titleUrdu = req.body.titleUrdu;
  chapter.tags = req.body.tags;
  if(req.file){
  chapter.audio = req.file.filename;
  }
  if(req.user.role === 'admin'){
    chapter.approved = true;
  }else{
    chapter.approved = false;
  }

  await chapter.save();
  res.send(chapter);
});




module.exports = router;
