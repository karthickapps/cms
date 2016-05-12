var async = require('async');
var Contact = require('../models/contact');

function ContactController(){};

var isExist = function(req, cb){
	var data = req.body;
	if(req && data && data.email && data.name && data.phoneNumber){
		var query = {};
		query.email = data.email;
		if(data._id){
			query._id = {$ne : data._id}
		}
		Contact.find(query, function(err, result){
			if(!result.length){
				return cb(null, req);
			}else{
				return cb("Contact already exist");
			}
		});
	}else{
		return cb("Some fields are missing");
	}
};

var saveContact = function(req, cb) {
	var contact = new Contact(req.body);
    contact.save(function(err, data){
        if(err){
        	return cb("Error while saving contact");
        }else{
	        return cb(null, data);
        }
    });
};

var updateContact = function(req, cb){
	var data = req.body;
	if(data._id){
		Contact.update({_id:data._id}, data, function(err, data){
	        if(err){
	        	return cb("Error while update contact");
	        }else{
		        return cb(null, data);
	        }
	    });
	}else{
		return cb("Id is missing");
	}
};

ContactController.prototype.saveContact = function(req, res){
	async.waterfall([
        isExist.bind(this, req),
        saveContact,
    ], function (err, data) {
        if (err) {
            res.status(400);
        	return res.json({data : null, message : err});
        } else {
            res.status(200);
	        return res.json({data : data, message : null});
        }
    });
};

ContactController.prototype.updateContact = function(req, res) {
	async.waterfall([
        isExist.bind(this, req),
        updateContact,
    ], function (err, data) {
        if (err) {
            res.status(400);
        	return res.json({data : null, message : err});
        } else {
            res.status(200);
	        return res.json({data : data, message : null});
        }
    });
};

ContactController.prototype.getContacts = function(req, res) {
	Contact.find({}, function(err, contacts){
	    if(err){
        	res.status(400);
        	return res.json({data : null, message : "Error while fetching contacts"});
        }else{
	        res.status(200);
	        return res.json({data : contacts, message : null});
        } 
	}); 
};

ContactController.prototype.deleteContact = function(req, res){
    Contact.remove({_id:req.params.id},function(err){
    	if(err){
 			return res.json({data:null, message:"Error while deleting contact"});
		}else{
			return res.json({data:"removed", message:null});
		}
	});
};

module.exports = function () {
	return new ContactController();
}();
 