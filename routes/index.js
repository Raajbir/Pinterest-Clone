var express = require('express');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local');
var userModel = require("./users");
var postModel = require("./posts");
const upload = require("./multer")

passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{nav:false});
});

router.get('/register', function(req, res, next) {
  res.render('register',{nav:false});
});

router.post('/register',function(req,res){
  var user = new userModel({
    username: req.body.username,
    fullname:req.body.fullname,
    number:req.body.number
  })

  userModel
    .register(user,req.body.password)
    .then(function(registeredUser){
      passport.authenticate('local')(req,res,function(){
        res.redirect("/profile");
      })
    })
})

router.get('/profile',isLoggedIn,async function(req,res){
  var user= await userModel.findOne({
    username: req.session.passport.user,
  }).populate("posts")
  res.render("profile",{user,nav:true});
})

router.post('/fileupload',isLoggedIn,upload.single("image"),async function(req,res){
  var user= await userModel.findOne({
    username: req.session.passport.user,
  })
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect('/profile');
})

router.post('/login',passport.authenticate('local',{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req,res){})

router.get('/logout', function(req,res,next){
  req.logout (function(err){
    if(err) return next(err);
  res.redirect('/');
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated())
  return next();
  res.redirect('/');
}

router.get('/add',async function(req,res,next){
  res.render('add',{nav:true});
})

router.post('/add',isLoggedIn,upload.single("image"),async function(req,res){
  var post = await postModel.create({
    image: req.file.filename,
    title:req.body.title,
    description:req.body.description,
  })
  var user= await userModel.findOne({
    username: req.session.passport.user,
  })
  post.username = user._id;
  await post.save();
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');
})

router.get("/show",isLoggedIn,async function(req,res){
  var user= await userModel.findOne({
    username: req.session.passport.user,
  }).populate('posts')
  res.render('show',{user,nav:true})
})

router.get("/feed",isLoggedIn,async function(req,res){
  var post= await postModel.find().populate('username');
  res.render('feed',{post,nav:true})
})

router.get('/post/:cardid',async function(req,res){
  var cardid = await postModel.findOne({
    image: req.params.cardid
  })
  res.render('post',{cardid,nav:true});
})  

router.get('/edit',isLoggedIn,async function(req,res){
  var user= await userModel.findOne({
    username:req.session.passport.user
  })
  res.render('edit',{user,nav:true});
})

router.post('/edit', isLoggedIn, async function(req,res){
  await userModel.updateOne({
    username:req.session.passport.user
  },{
    $set:{
      fullname:req.body.fullname,
      number: req.body.number
    }
  });
  res.redirect('/profile');
})

module.exports = router;
