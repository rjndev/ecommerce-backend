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
		currentUser.currentOrders = createdOrder._id
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
		const allProducts = await Product.find()
 		
		const userOrder = await Order.findById(user.currentOrders)
		
		userOrder.products.forEach(product => {
			let productDetails = allProducts.find(curr => curr._id.toString() == product.productId)
			console.log(productDetails)
			product.productDetails = productDetails
		})

		return userOrder
		// const userOrders = []


		// user.currentOrders.forEach(order => {
		// 	userOrders.push(allOrders.find(curr => curr._id.toString() == order.orderId))
		// })
		

		
		// //attach the product details on the response so it can be used by the client
		// userOrders.map(order => {
		// 	order.products.map(product => {
		// 		let productDetails = allProducts.find(curr => curr._id.toString() == product.productId)
		// 		product.productDetails  = productDetails
		// 	})
		// })
		// // let queryFilter = {}
		// console.log("PRODUCTSUSERORDER")
		// console.log(userOrders)
		

		// return userOrders
	}catch(err) {
		console.log(err)
		return false
	}
}

module.exports.addToCart = async (id, data) => {
	try {	
		const user = await User.findById(id)
		
		//Check if there is order
		if(user.currentOrders !== "") {
			//if there is order add to that order
			const order = await Order.findOne({userId : id})
			console.log(id)
			console.log(order.products)
			order.products = [...order.products, data]

			await order.save()
			return true
		}else {

			console.log("NO ORDER FOUND CREATING ORDER..")
			const result =await module.exports.createOrder(id, {products : [data]})
			if(result) 
				return true
			else return false
		}
	}catch (err) {
		console.log(err)
		return false
	}
}