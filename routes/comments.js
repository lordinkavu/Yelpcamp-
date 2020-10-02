const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require('../middleware')
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("comments/new", { id: req.params.id });
});
router.post("/", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
      
      res.redirect("/campgrounds");
    } else {
      if (!foundCampground) {
        return res.status(400).send("Item not found.")
    }
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save()
          foundCampground.comments.push(comment);
          foundCampground.save();
          req.flash('success','Comment added !')
          res.redirect("/campgrounds/" + foundCampground._id);
        }
      });
    }
  });
});
router.delete('/:id',middleware.checkCommentOwnership,async(req,res)=>{
  try {
    await Comment.remove({_id: req.params.id})
    req.flash("success","Comment removed !")
    res.redirect('back')
  } catch (error) {
    console.log(error.message);
    res.redirect("back");
  }
})

module.exports = router;
