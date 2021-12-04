var express = require("express");
const multer = require("multer");
var router = express.Router();
const { Book } = require("../../model/Book");
const { User } = require("../../model/users");
const validateBook = require("../../middleware/validateBook");
const auth = require("../../middleware/auth");

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

router.get("/", auth, async (req, res) => {
  const books = await Book.find({approved:true});
  res.send(books);
});
router.get("/unapproved_books", auth, async (req, res) => {
  const books = await Book.find({approved:false,disapproved:false});
  res.send(books);
});

router.get("/people_contributions", auth, async (req, res) => {

  const books = await Book.find({contributionType:"user"});
  
  res.send(books);
});

//get searched book
router.post("/searched", auth, async (req, res) => {
  console.log("reached here");
  console.log(req.body);
  var book = await Book.find({ title: req.body.searchedVal });
  console.log(book);
  res.send(book);
});

//get filtered books
router.post("/filtered", auth, async (req, res) => {
  console.log("reached here");
  console.log(req.body);
  var book = await Book.find(
    req.body.parentVal && req.body.subVal && req.body.genreVal
      ? {
          categories: req.body.parentVal,
          subCategory: req.body.subVal,
          genre: req.body.genreVal,
        }
      : req.body.parentVal && req.body.subVal == "" && req.body.genreVal == ""
      ? {
          categories: req.body.parentVal,
        }
      : req.body.parentVal == "" && req.body.subVal && req.body.genreVal == ""
      ? {
          subCategory: req.body.subVal,
        }
      : req.body.parentVal == "" && req.body.subVal == "" && req.body.genreVal
      ? {
          genre: req.body.genreVal,
        }
      : req.body.parentVal && req.body.subVal && req.body.genreVal == ""
      ? {
          categories: req.body.parentVal,
          subCategory: req.body.subVal,
        }
      : req.body.parentVal && req.body.subVal == "" && req.body.genreVal
      ? {
          categories: req.body.parentVal,
          genre: req.body.genreVal,
        }
      : req.body.parentVal == "" && req.body.subVal && req.body.genreVal
      ? {
          subCategory: req.body.subVal,
          genre: req.body.genreVal,
        }
      : req.body.parentVal == "" && req.body.subVal && req.body.genreVal
      ? {
          subCategory: req.body.subVal,
          genre: req.body.genreVal,
        }
      : ""
  );
  console.log(book);
  res.send(book);
});

//Show all the stories specific to person
router.get("/myaudiobooks", auth, async (req, res) => {
  var book = await Book.find({ user_id: req.user._id }).sort({
    date: "desc",
  });
  console.log(book);
  console.log("end");
  if (book.length == 0) {
    book = null;
  }
  var user = req.user;
  res.send(book);
});

//Show all the disapproved stories specific to person
router.get("/myaudiobooks_disapproved", auth, async (req, res) => {
  var book = await Book.find({ user_id: req.user._id, disapproved:true }).sort({
    date: "desc",
  }).limit(9);
  console.log(book);
  console.log("end");
  if (book.length == 0) {
    book = null;
  }
  var user = req.user;
  res.send(book);
});

//Show all the unapproved stories specific to person
router.get("/myaudiobooks_unapproved", auth, async (req, res) => {
  var book = await Book.find({ user_id: req.user._id, approved:false,disapproved:false }).sort({
    date: "desc",
  }).limit(9);
  console.log(book);
  console.log("end");
  if (book.length == 0) {
    book = null;
  }
  var user = req.user;
  res.send(book);
});

//Show all the approved stories specific to person
router.get("/myaudiobooks_approved", auth, async (req, res) => {
  var book = await Book.find({ user_id: req.user._id, approved:true }).sort({
    date: "desc",
  });
  console.log(book);
  console.log("end");
  if (book.length == 0) {
    book = null;
  }
  var user = req.user;
  res.send(book);
});

router.get("/:id", auth, async (req, res) => {
  const books = await Book.findById(req.params.id);
  res.send(books);
});

router.post(
  "/",
  auth,
  upload.single("image"),
  validateBook,
  async (req, res) => {
    console.log(req.body);
    const book = new Book();
    book.user_id = req.user._id;
    book.title = req.body.title;
    book.titleUrdu = req.body.titleUrdu;
    book.narrator = req.body.narrator;
    book.contributor = req.body.contributor;
    book.author = req.body.author;
    if (req.user.role === "admin") {
      book.approved = true;
      book.contributionType = "admin";
    } else {
      book.approved = false;
      book.disapproved = false;
      book.contributionType = "user";
    }
    if (req.file) {
      book.image = req.file.filename;
    }
    book.description = req.body.description;
    book.categories = req.body.categories;
    book.subCategory = req.body.subCategory;
    book.genre = req.body.genre;
    await book.save();
    res.send(book);
  }
);

router.put("/approve/:id", auth, async (req, res) => {
  const book = await Book.findById(req.params.id);
  book.approved = true;
  await book.save();
  res.send(book);
});

router.put("/disapprove/:id", auth, async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  book.disapproved = true;
  book.disapproval_message = req.body.message;
  await book.save();
  res.send(book);
});


router.put(
  "/:id",
  auth,
  upload.single("image"),
  validateBook,
  async (req, res) => {
    console.log(req.body);
    const book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.narrator = req.body.narrator;
    book.contributor = req.body.contributor;
    book.titleUrdu = req.body.titleUrdu;
    book.author = req.body.author;
   
    if (req.file) {
      book.image = req.file.filename;
    }
    if (req.user.role === "admin") {
      book.approved = true;
      book.disapproved = false;
    } else {
      book.approved = false;
      book.disapproved = false;
    }
    book.description = req.body.description;
    book.categories = req.body.categories;
    book.subCategory = req.body.subCategory;
    book.genre = req.body.genre;
    await book.save();
    res.send("success");
  }
);

router.delete("/:id", auth, async (req, res) => {
  let book = await Book.findByIdAndRemove(req.params.id);
  res.send(book);
});

module.exports = router;
