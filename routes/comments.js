const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");
router.get("/new", isLoggedIn, (req, res) => {
  res.render("comments/new", { id: req.params.id });
});
router.post("/", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save()
          foundCampground.comments.push(comment);
          foundCampground.save();
          res.redirect("/campgrounds/" + foundCampground._id);
        }
      });
    }
  });
});
router.delete('/:id',checkCommentOwnership,async(req,res)=>{
  try {
    await Comment.remove({_id: req.params.id})
    res.redirect('back')
  } catch (error) {
    console.log(error.message);
    res.redirect("back");
  }
})
function checkCommentOwnership(req,res,next){
  if(req.isAuthenticated()){
    
     Comment.findById(req.params.id,(err,foundComment)=>{
      if(err){
        res.redirect('back')
      }else{
        if(foundComment.author.id.equals(req.user._id)){
          next()
        }else{
          res.redirect('back')
        }
      }
    }) 
  }else{
    res.redirect('back')
  }
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
module.exports = router;
