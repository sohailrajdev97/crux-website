var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var membersSchema = new Schema({
    name: String,
    github: String,
    tagline: String,
    description: String,
    skills: [String],
    picture: String,
    email: {
    	type: String,
    	default: ""
    },
    phone: {
    	type: String,
    	default: ""
    }
});

var model = mongoose.model('members', membersSchema);

module.exports = model;