var express =require('express');
var router = express.Router();
var Celebrity = require('../models/celebrity');

router.use(function (req,res,next) {
    res.locals.currentUser=req.user;
    next();
});


router.get('/',function (req,res) {
    Celebrity.find({},function (err,celebrities) {
        if(err){
            console.log(err);
        }else{
            res.render("celebrities/celebrity",{celebrities:celebrities});
        }
    });
});

router.post('/',isLoggedIn,function (req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var about = req.body.about;
    var author = {id:req.user._id,username:req.user.username}
    var newCelebrity = {name:name,image:image,about:about,author:author};
    Celebrity.create(newCelebrity,function (err,celebrities) {
        if(err){
            console.log(err);
        }else {
            res.redirect("/celebrity");
        }
    });

});

router.get('/new',isLoggedIn,function (req,res) {
    res.render("celebrities/new");
});


router.get('/:id',function (req,res) {
    Celebrity.findById(req.params.id).populate("comments").exec(function (err,foundCelebrity) {
        if(err){
            console.log(err);
        }else{
            res.render("celebrities/about",{celebrity:foundCelebrity});
        }
    });
});


router.get('/:id/edit',function (req,res) {
    Celebrity.findById(req.params.id,function (err,foundCelebrity) {
        if(err){
            return res.redirect('/celebrity')
        }
        res.render("celebrities/edit",{celebrity:foundCelebrity});
    });
});

router.put('/:id',function (req,res) {

        // Yes, it's a valid ObjectId, proceed with `findById` call.
        // console.log("error is not here \n");
        Celebrity.findById(req.params.id,function (err,editedCelebrity) {
            if(err){
                res.redirect('/celebrity');
            }else{
                editedCelebrity.update(req.body.celebrity);
                editedCelebrity.save();
                res.redirect('/celebrity/'+req.params.id);
            }
        });
});

router.delete('/:id',function (req,res) {
    Celebrity.findByIdAndRemove(req.params.id,function (err,removedCelebrity) {
        if(err){
            res.redirect('/celebrity');
        }else{
            res.redirect('/celebrity');
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