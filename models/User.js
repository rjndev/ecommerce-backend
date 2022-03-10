const mongoose = require('mongoose')

const userSchema =  mongoose.Schema({
	firstName : {
		type : String,
		required : true
	}, 
	lastName : {
		type : String, 
		required : true
	},
	email : {
		type : String, 
		required : true
	},
	password : {
		type : String,
		required : true
	},
	isAdmin : {
		type : Boolean,
		default : false
	},
	currentOrders : {
		type : Array,
		default : []
	}
})


module.exports = mongoose.model("User", userSchema)