const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
router.get("/", (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: campgrounds });
    }
  });
});
router.post("/", isLoggedIn,(req, res) => {
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  }
  let newCampground = { name: name, image: image, description: desc , author: author};
  Campground.create(newCampground, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      console.log(campground);
    }
  });
  res.redirect("/campgrounds");
});
router.get("/new",isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
router.get("/:id", (req, res) => {
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

router.get('/:id/edit',(req,res)=>{
   Campground.findById(req.params.id,(err,foundCampground)=>{
     if(err){
       res.redirect('/')
     }else{
      res.render('campgrounds/edit', {campground: foundCampground})
     }
   })
  
})
router.put('/:id',(req,res)=>{
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
    if(err){
      res.redirect('/campgrounds')
    }else{
      res.redirect('/campgrounds/'+ req.params.id)
    }
  })
})
router.delete('/:id',(req,res)=>{
   Campground.findByIdAndRemove(req.params.id,(err)=>{
     if(err){
       res.redirect('/campgrounds')
     }else{
       res.redirect('/campgrounds')
     }
   })
})
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
module.exports = router;
