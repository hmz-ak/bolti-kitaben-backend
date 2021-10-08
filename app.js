var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/api/users");
var booksRouter = require("./routes/api/books");
var categoriesRouter = require("./routes/api/categories");
var subCategoriesRouter = require("./routes/api/subCategories");
var genresRouter = require("./routes/api/genres");
var chaptersRouter = require("./routes/api/chapters");

var mongoose = require("mongoose");
var config = require("config");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cors());
app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ limit: "1000mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/books", booksRouter);
app.use("/api/subCategories", subCategoriesRouter);
app.use("/api/genres", genresRouter);
app.use("/api/chapters", chaptersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

mongoose
  .connect(config.get("db"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database has been connected"))
  .catch((err) => console.log(err));

module.exports = app;
