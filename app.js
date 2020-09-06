const express= require('express');
const bodyParser=require('body-parser');
const app=express();
const mongoose= require('mongoose');
const Campground = require("./models/campground")
const Comment   = require("./models/comment");
const Seeds = require("./seeds")
mongoose.connect('mongodb://localhost/x_camp', {useNewUrlParser: true,useUnifiedTopology: true });




app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"))

Seeds();

app.get('/',(req,res)=>{
    res.render('landing');
});
app.get('/campgrounds',(req,res)=>{
    Campground.find({},(err,campgrounds)=>{
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index",{campgrounds:campgrounds});
        }

    }
    )
    
   

});

app.post('/campgrounds',(req,res)=>{
    let name=req.body.name;
    let image=req.body.image;
    let desc=req.body.description;
    let newCampground={name:name,image:image, description:desac};
    Campground.create(newCampground,(err,campground)=>{
            if(err){
                console.log(err)
            }else{
                console.log(campground)
            }
    });
    res.redirect('/campgrounds'); 

       
});
app.get('/campgrounds/new',(req,res)=>{
    res.render("campgrounds/new");
})
app.get('/campgrounds/:id',(req,res)=>{
    Campground.findById(req.params.id).populate('comments').exec((err,foundCampground)=>{
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground)
            res.render("campgrounds/show",{campground:foundCampground});
        }
    })
    
})

//Comment Routes
app.get('/campgrounds/:id/comments/new',(req,res)=>{
    res.render('comments/new',{id:req.params.id})
})
app.post('/campgrounds/:id/comments',(req,res)=>{
    Campground.findById(req.params.id,(err,foundCampground)=>{
        if(err){
            console.log(err)
            res.redirect('/campgrounds')
        }else{
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log(err)
                }else{
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect('/campgrounds/'+foundCampground._id)
                }
            })
        }
    })
})

app.listen(3000,()=>{
    console.log("listening from port 3000");
})
