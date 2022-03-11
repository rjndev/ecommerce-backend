const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
	name : {
		type : String,
		required : [true, "Name is required"]
	},
	products : {
		type : Array,
		default : []
	}
})

module.exports = mongoose.model('categories', categorySchema)