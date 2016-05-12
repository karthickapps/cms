var express = require('express');
var router = express.Router();
var accountController = require("../controllers/accountController.js");
var contactController = require("../controllers/contactController.js");
var passport = require('passport');

//Middleware to ensure authentication
var isAuthenticated = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};

router.get('/', function (req, res) {
   res.render('login', {});
});

router.get('/register', function(req, res) {
    res.render('register', {});
});

router.post('/register', function(req, res){
    accountController.register(req, res);
});

router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/contacts',
        failureRedirect: '/',
        failureFlash: true 
     })
   );

router.get('/logout', isAuthenticated, function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/contacts', isAuthenticated, function(req, res){
    res.render('contacts',{user:req.user});
});

router.get('/getContacts', isAuthenticated, contactController.getContacts);
router.post('/saveContact', isAuthenticated, contactController.saveContact);
router.post('/updateContact', isAuthenticated, contactController.updateContact);
router.delete("/deleteContact/:id", isAuthenticated, contactController.deleteContact);
   
module.exports = router;