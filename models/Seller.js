import mongoose from 'mongoose'
import dbConstants from '../dbConstants.js'
const { Schema } = mongoose

const sellerSchema = mongoose.Schema({
	storeName : {
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
	products : [{type : Schema.Types.ObjectId, ref : 'Products'}],
	salesHistory : {
		type : Array, 
		default : []
	}
})

export default mongoose.model(dbConstants.sellerString, sellerSchema)