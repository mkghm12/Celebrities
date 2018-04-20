var express =require('express');
var router = express.Router({mergeParams:true});
var Celebrity = require('../models/celebrity');
var Comment = require('../models/comment');
router.use(function (req,res,next) {
    res.locals.currentUser=req.user;
    next();
});


router.get('/new',isLoggedIn,function (req,res) {
    Celebrity.findById(req.params.id,function (err,foundCelebrity) {
        if(err){
            console.log(err);
        }else{
            res.render('comments/new',{celebrity:foundCelebrity});
        }
    })
});

router.post('/',isLoggedIn,function (req,res) {
    Comment.create(req.body.comment,function (err,comment) {
        if(err){
            console.log(err);
        }else {
            Celebrity.findById(req.params.id).populate("comments").exec(function (err,updatedCelebrity) {
                if(err){
                    console.log(err);
                    res.redirect('/celebrity');
                } else{
                    comment.author.id =req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    updatedCelebrity.comments.push(comment);
                    updatedCelebrity.save();
                    res.redirect('/celebrity/'+updatedCelebrity._id);
                }
            });


        }
    });
});


function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}


module.exports = router;