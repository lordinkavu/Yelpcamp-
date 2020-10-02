const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const middleware = require('../middleware')
router.get("/", (req, res) => {
  res.render("landing");
});
// Auth routes
router.get("/register", (req, res) => {
  res.render("user/register");
});
router.post("/register", (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        req.flash('error',err.message)
        res.redirect("/register");
      }
      passport.authenticate("local")(req, res, () => {
        req.flash('success', " Successfully registered as" + user.username)
        res.redirect("/campgrounds");
      });
    }
  );
});
//Log in
router.get("/login", (req, res) => {
  res.render("user/login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: 'Welcome !'
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash('success', 'Logged out successfully!')
  res.redirect("/campgrounds");
});

module.exports = router;
