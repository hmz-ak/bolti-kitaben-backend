let { validateData } = require("../model/Genre");
//middleware to check data if it passes joi validation or not
function validateGenre(req, res, next) {
  console.log(req.body);
  let { error } = validateData(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  next();
}

module.exports = validateGenre;
