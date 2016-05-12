var async = require('async');
var passport = require('passport');
var Account = require('../models/account');

function AccountController(){};

var isValid = function(req, cb){
	if(req.body){
		var username = req.body.username;
		var password = req.body.password;
		if(!username){
			return cb("Username is required", null);
		}
		if(!password){
			return cb("Password is required", null);
		}
		return cb(null, req);
	}else{
		return cb("Username and password is required", null);
	}
};

var register = function(req, cb){
	Account.register(new Account({ username : req.body.username }), req.body.password, function(err, Account) {
        if (err) {
          return cb(err.message, null);
        }else{
        	return cb(null, "Account created");
        }
	});
};

AccountController.prototype.register = function(req, res){
	async.waterfall([
        isValid.bind(this, req),
        register,
    ], function (err, data) {
        if (err) {
            res.redirect('/register');
        } else {
            passport.authenticate('local')(req, res, function () {
	            res.redirect('/contacts');
	        });
        }
    });
};

module.exports = function () {
	return new AccountController();
}();