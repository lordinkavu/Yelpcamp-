const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require('../middleware')
const flash = require('connect-flash');

router.get("/", (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      
      res.render("campgrounds/index", { campgrounds: campgrounds });
    }
  });
});
router.post("/", middleware.isLoggedIn,(req, res) => {
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
      req.flash('success',"Campground created !")
    }
  });
  res.redirect("/campgrounds");
});
router.get("/new",middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
router.get("/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err);
        req.flash('error',"Couldn't find campground")
      } else {
        if (!foundCampground) {
          return res.status(400).send("Item not found.")
      }
        console.log(foundCampground);
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

router.get('/:id/edit', middleware.checkCampgroundOwnership,(req,res)=>{
   Campground.findById(req.params.id,(err,foundCampground)=>{
     if(err){
       res.redirect('/')
     }else{
      if (!foundCampground) {
        return res.status(400).send("Item not found.")
    }
      res.render('campgrounds/edit', {campground: foundCampground})
     }
   })
  
})
router.put('/:id', middleware.checkCampgroundOwnership,(req,res)=>{
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err,updatedCampground)=>{
    if(err){
      res.redirect('/campgrounds')
    }else{
      if (!foundCampground) {
        return res.status(400).send("Item not found.")
    }
      req.flash("success","Successfully updated campground")
      res.redirect('/campgrounds/'+ req.params.id)
    }
  })
})
router.delete('/:id', middleware.checkCampgroundOwnership, async(req,res)=>{
    try {
    let foundCampground = await Campground.findById(req.params.id);
    if (!foundCampground) {
      return res.status(400).send("Item not found.")
  }
    await foundCampground.remove();
    req.flash('success',"Successfully removed the campground")
    res.redirect("/campgrounds");
  } catch (error) {
    console.log(error.message);
    res.redirect("/campgrounds");
  }
   
})

module.exports = router;
