const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const flash = require('connect-flash');

const passport = require("passport");
const localStrategy = require("passport-local");
const methodOverride = require('method-override')

const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const Seeds = require("./seeds");
const User = require("./models/user");
const commentRoutes = require("./routes/comments.js"),
  campgroundRoutes = require("./routes/campgrounds.js"),
  indexRoutes = require("./routes/index.js");

mongoose.connect('mongodb+srv://Gautham:blum@cluster0.rem36.mongodb.net/<dbname>?retryWrites=true&w=majority')
app.use(flash());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))

// Passport configuration
app.use(
  require("express-session")({
    secret: "Hello World!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.errormessage= req.flash("error");
  res.locals.successmessage = req.flash('success');
  next();
});
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);

//Seeds();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("listening from port 3000");
});
