import mongoose from 'mongoose'
import dbConstants from '../dbConstants.js'
const {Schema} = mongoose


const categorySchema = mongoose.Schema({
	name : {
		type : String,
		required : [true, "Name is required"]
	},
	products : [{type : Schema.Types.ObjectId, ref : 'Products'}],
	imagePath : {
		type : String, 
		required : [true, "Image path is requried"]
	}
})


export default mongoose.model(dbConstants.categoriesString, categorySchema)