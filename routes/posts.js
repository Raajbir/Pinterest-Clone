var mongoose=require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/PinterestProject")

const postSchema = mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  image:{
    type:String,
    required:true,
  },
  username:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  }
})

module.exports = mongoose.model("post",postSchema);