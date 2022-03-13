const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
	name : {
		type : String,
		required : [true, "Name is required"]
	},
	description : {
		type : String,
		required : [true, "Description is required"]
	},
	price : {
		type : Number, 
		required : [true, "Price is required"]
	},
	isActive : {
		type : Boolean,
		default : true
	},
	createdOn : {
		type : Date,
		default : new Date()
	},
	rating : {
		type : Number,
		defualt : 0.0
	},
	categories : {
		type : Array,
		required : [true, "Categories is required at least one"]
	},
	imagePath : {
		type : String,
		default : "/images/pizza.png"
	}	
})


module.exports = mongoose.model('Products', productSchema)