const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
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
        res.render("user/register");
      }
      passport.authenticate("local")(req, res, () => {
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
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
module.exports = router;
