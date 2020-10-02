const Campground = require("../models/campground");
const Comment = require("../models/comment");
module.exports = {
    checkCampgroundOwnership: function(req,res,next){
        if(req.isAuthenticated()){
          Campground.findById(req.params.id,(err,foundCampground)=>{
            if(err){
              res.redirect('back')
            }else{
              if(foundCampground.author.id.equals(req.user._id)){
              
                next()
              }else{
                req.flash("error","Permission denied")
                res.redirect('back')
              }
            }
          })
        }
        else{
          req.flash("error","Permission denied")
          res.redirect('back')
        }
      },
    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
          return next();
        }
        req.flash('error',"Please Log In ")
        res.redirect("/login");
      },

    checkCommentOwnership: function(req,res,next){
        if(req.isAuthenticated()){
          
           Comment.findById(req.params.id,(err,foundComment)=>{
            if(err){
              res.redirect('back')
            }else{
              if(foundComment.author.id.equals(req.user._id)){
                next()
              }else{
                req.flash("error","Permission denied")
                res.redirect('back')
              }
            }
          }) 
        }else{
          req.flash("error","Permission denied")
          res.redirect('back')
        }
      }
}