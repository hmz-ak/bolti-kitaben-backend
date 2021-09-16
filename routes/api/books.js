var express = require("express");
const multer = require("multer");
var router = express.Router();

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
  console.log(req.file);
  res.send(req.file);
});

module.exports = router;
