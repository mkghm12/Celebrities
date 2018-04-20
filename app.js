var express = require('express');
var app = express();
var mongoose =require("mongoose");
var bodyParser = require('body-parser');
var passport =require('passport');
var localStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var methodOverride = require('method-override');
var User = require('./models/user');
var Celebrity = require('./models/celebrity');
var Comment = require('./models/comment');
var celebrityRoute = require('./routes/celebrity');
var commentRoute = require('./routes/comments');
var authRoute = require('./routes/index');
var seedDB = require('./seed');


mongoose.connect('mongodb://localhost/cel_app');
app.use(require('express-session')({
    secret:"I am crazy.",
    resave:false,
    saveUninitialized:false
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
seedDB();
app.use("/celebrity",celebrityRoute);
app.use(authRoute);
app.use("/celebrity/:id/comments",commentRoute);

app.use(function (req,res,next) {
    res.locals.currentUser=req.user;
    next();
});




app.get('/',function (req,res) {
    res.render('home');
});


app.listen(2000,function () {
    console.log("server is started");
});
