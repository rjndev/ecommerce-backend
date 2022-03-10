const mongoose = require('mongoose')

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
	}
})

module.exports = mongoose.model('Order', orderSchema)