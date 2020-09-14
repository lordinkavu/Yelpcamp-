const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");
const localStrategy = require("passport-local");

const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const Seeds = require("./seeds");
const User = require("./models/user");
mongoose.connect("mongodb://localhost/x_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

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
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    next();
})

Seeds();

app.get("/", (req, res) => {
  res.render("landing");
});
app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: campgrounds });
    }
  });
});

app.post("/campgrounds", (req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newCampground = { name: name, image: image, description: desac };
  Campground.create(newCampground, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      console.log(campground);
    }
  });
  res.redirect("/campgrounds");
});
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
      } else {
        console.log(foundCampground);
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//Comment Routes
app.get("/campgrounds/:id/comments/new", isLoggedIn,(req, res) => {
  res.render("comments/new", { id: req.params.id });
});
app.post("/campgrounds/:id/comments", isLoggedIn,(req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          foundCampground.comments.push(comment);
          foundCampground.save();
          res.redirect("/campgrounds/" + foundCampground._id);
        }
      });
    }
  });
});

// Auth routes
app.get("/register", (req, res) => {
  res.render("user/register");
});
app.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.render("user/register");
      }
      passport.authenticate("local")(req, res, () => {
        res.redirect("/campgrounds");
      });
    }
  );
});
//Log in
app.get("/login", (req, res) => {
  res.render("user/login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/campgrounds');
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}
app.listen(3000, () => {
  console.log("listening from port 3000");
});
