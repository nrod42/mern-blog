const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
// const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 8080;

const indexRouter = require("./routes/index");

// Set up mongoose connection

// mongoose.set("strictQuery", false);
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URL;

(async function () {
  await mongoose.connect(mongoDB);
})();

app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "https://mernblog-2g36.onrender.com",
      "https://www.mernblog-2g36.onrender.com",
      "https://mernblog-api-2lf4.onrender.com",
      "https://www.mernblog-api-2lf4.onrender.com",
    ],
  })
); //issue when deploying?
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use("/", indexRouter);

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

app.listen(PORT);
console.log(`Server is listening on port ${PORT}`);

module.exports = app;
