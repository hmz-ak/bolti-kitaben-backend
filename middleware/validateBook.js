let { validateData } = require("../model/Book");
//middleware to check data if it passes joi validation or not
function validateBook(req, res, next) {
  console.log(req.body);
  let { error } = validateData(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}

module.exports = validateBook;
