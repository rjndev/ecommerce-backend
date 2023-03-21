import mongoose from 'mongoose'
import dbConstants from '../dbConstants.js'
const {Schema} = mongoose


const orderSchema = mongoose.Schema({
	totalAmount : {
		type : Number,
		default : 0
	},
	purchasedOn : {
		type : Date,
		default : new Date()
	},
	userId : {
		type : String,
		required : [true, "Need ID"]
	},
	products : {
		type : Array,
		default : []
	},
	deliveryStatus : {
		type : Number,
		default: 0
	},
	productDetails : [{type : Schema.Types.ObjectId, ref : 'Products'}]
})

// module.exports = mongoose.model('Order', orderSchema)
export default mongoose.model(dbConstants.orderString, orderSchema)