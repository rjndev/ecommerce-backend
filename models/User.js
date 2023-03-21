import mongoose from 'mongoose'
import dbConstants from '../dbConstants.js'

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
		type : String,
		default : ""
	}
})


export default mongoose.model(dbConstants.userString, userSchema)