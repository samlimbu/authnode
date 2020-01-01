var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var categorySchema = new Schema({
	"id": Number,
	"name": String
})
mongoose.model('category', categorySchema); //schema name