const Order = require('../models/Order')
const User = require('../models/User')
const Product = require('../models/Product')
const mongoose = require('mongoose')
const { findById } = require('../models/Product')


//User checkout
module.exports.createOrder = async (userId, data) => {
	//This controller function gets all necessary product prices and adds them all up to be stored on Order's totalAmount price
	//Then save Order model to database and update User's current order with it's ID
	try {

		let allProducts = await Product.find()


		let currentTotal = 0
		data.products.forEach(product => {
			let foundProduct = allProducts.find((current) => current._id.toString() == product.productId)
			currentTotal += foundProduct.price * product.amount
		})

		let createdOrder = new Order({
			totalAmount : currentTotal,
			userId : userId,
			products : data.products
		})

		console.log(createdOrder)

		let currentUser = await User.findById(userId)
		currentUser.currentOrders = [...currentUser.currentOrders ,  {orderId : createdOrder._id}]
		console.log(currentUser)

		
		
		await createdOrder.save()
		await currentUser.save()

		return true

	}catch(err) {
		console.log(err)
		return false
	}
}

module.exports.getAllOrders = async () => {
	try {
		const allOrders = await Order.find()

		return allOrders
	}catch(err) {
		console.log(err)
		return false1
	}
}

module.exports.getUserOrders = async (id) => {
	try {
		const user = await User.findById(id)
		const allOrders = await Order.find()
		const userOrders = []


		user.currentOrders.forEach(order => {
			userOrders.push(allOrders.find(curr => curr._id.toString() == order.orderId))
		})
		
		return userOrders
	}catch(err) {
		console.log(err)
		return false
	}
}