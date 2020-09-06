const express= require('express');
const bodyParser=require('body-parser');
const app=express();
const mongoose= require('mongoose');
const Campground = require("./models/campground")
const Seeds = require("./seeds")
mongoose.connect('mongodb://localhost/x_camp', {useNewUrlParser: true,useUnifiedTopology: true });




app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


Seeds();

app.get('/',(req,res)=>{
    res.render('landing');
});
app.get('/campgrounds',(req,res)=>{
    Campground.find({},(err,campgrounds)=>{
        if(err){
            console.log(err)
        }else{
            res.render("index",{campgrounds:campgrounds});
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
    res.render("new");
})
app.get('/campgrounds/:id',(req,res)=>{
    Campground.findById(req.params.id).populate('comments').exec((err,foundCampground)=>{
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground)
            res.render("show",{campground:foundCampground});
        }
    })
    
})

app.listen(3000,()=>{
    console.log("listening from port 3000");
})
