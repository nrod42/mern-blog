const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
const port = process.env.PORT || 8080;
dotenv.config();

const indexRouter = require("./routes/index");

// Set up mongoose connection

// mongoose.set("strictQuery", false);
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URL;

(async function () {
  await mongoose.connect(mongoDB);
})();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
// console.log(process.env.MONGO_URL);

app.listen(port);
console.log(`Server is listening on port ${port}`);

module.exports = app;
