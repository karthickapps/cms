var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contacts = new Schema({
    name: String,
    email: String,
    dob : String,
    phoneNumber : String,
    address : String,
    city : String,
    state : String,
    country : String
});

module.exports = mongoose.model('contacts', contacts);

