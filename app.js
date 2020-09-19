const express = require("express");
const bodyParser = require("body-parser");
const app = express();
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

mongoose.connect("mongodb://localhost/x_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
  next();
});
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);

//Seeds();

app.listen(3000, () => {
  console.log("listening from port 3000");
});
