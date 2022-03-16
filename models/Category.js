const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
	name : {
		type : String,
		required : [true, "Name is required"]
	},
	products : {
		type : Array,
		default : []
	},
	imagePath : {
		type : String, 
		required : [true, "Image path is requried"]
	}
})

module.exports = mongoose.model('categories', categorySchema)