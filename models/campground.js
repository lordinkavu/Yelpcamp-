
const mongoose= require('mongoose');
const Comment = require('./comment');


const campgroundschema= new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ],
    author: {
       id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
       },
       username: String 
    }
});
campgroundschema.pre('remove', async function() {
await Comment.remove({
   _id: {
      $in: this.comments
   }
});
});
module.exports=mongoose.model("Campground", campgroundschema);