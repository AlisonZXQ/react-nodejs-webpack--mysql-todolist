var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Todo = new Schema({
	content: {
		type: String, 
		required: true
	},
	date: {
		type: String, 
		required: true
	},
	status:{
		type: String,
		required: false,
	}
}, { collection: 'todo' });

module.exports = Todo;