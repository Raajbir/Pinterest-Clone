var mongoose=require('mongoose');
var plm =require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/PinterestProject")

const userSchema = mongoose.Schema({
  fullname:{
    type:String,
    required:true,
    unique:true
  },
  username:{
    type:String,
    required:true,
    unique:true
  },
  number:Number,
  password:String,
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"post"
  }],
  boards:[],
  profileImage:String
})

userSchema.plugin(plm);

module.exports = mongoose.model("user",userSchema);