const Order = require('../models/Order')
const User = require('../models/User')
const Seller = require('../models/Seller')
const Product = require('../models/Product')
const mongoose = require('mongoose')

//User checkout
module.exports.createOrder = async (userId, data) => {
	//This controller function gets all necessary product prices and adds them all up to be stored on Order's totalAmount price
	//Then save Order model to database and update User's current order with it's ID
	try {

		let queryFields = []
		let currentTotal = 0
		
		//push Product Ids to queryField to use for $or aggregate in find
		data.products.forEach(prod => {
			queryFields.push({'_id' : mongoose.Types.ObjectId(prod.productId)})
		})

		//find the Products involved in the order
		let foundProducts = await Product.find({
			"$or" : queryFields
		})

		//calculate the amount using the products
		data.products.forEach(prod => {
			let foundProd = foundProducts.find(current => current._id.toString() == prod.productId)
			currentTotal += foundProd.price * prod.amount
		})

		let createdOrder = new Order({
			totalAmount : currentTotal,
			userId : userId,
			products : data.products
		})

		//push Ids into the details for populate() later on when needed
		data.products.forEach(prod => {
			createdOrder.productDetails.push(mongoose.Types.ObjectId(prod.productId))
		})

		console.log("CREATED ORDER")
		console.log(createdOrder)

		let currentUser = await User.findById(userId)
		currentUser.currentOrders = createdOrder._id
		
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
		return false
	}
}

module.exports.payOrder2 = async (userId, orderId) => {

	console.log("ZZZ")
	try {
		console.log("FINDING")
		const user = await User.findById(userId)
		user.currentOrders = ""

		console.log("FOUND USER")
		console.log(user)

		const order = await Order.findByIdAndDelete(orderId)
		

		console.log("FOUND ORDER")
		console.log(order)

		await user.save()
		return true
	}catch(err) {
		console.log(err)
		return false
	}
}



module.exports.getUserOrders = async (id) => {
	try {
		const user = await User.findById(id)
		const allOrders = await Order.find()
		const allProducts = await Product.find()
 		
		const userOrder = await Order.findById(user.currentOrders).populate('productDetails').exec()
		
		// userOrder.products.forEach(product => {
		// 	let productDetails = allProducts.find(curr => curr._id.toString() == product.productId)
		// 	console.log(productDetails)
		// 	product.productDetails = productDetails
		// })

		return userOrder
	}catch(err) {
		console.log(err)
		return false
	}
}

module.exports.addToCart = async (id, data) => {
	try {	
		const user = await User.findById(id)
		const allProducts = await Product.find()
		
		//Check if there is order
		if(user.currentOrders !== "") {
			//if there is order add to that order
			const order = await Order.findOne({userId : id})
			console.log(id)
			console.log(order.products)
			order.products = [...order.products, data]
			order.productDetails = [...order.productDetails, mongoose.Types.ObjectId(data.productId)]

			await order.save()

			const newOrder = await Order.findOne({userId : id}).populate('productDetails').exec()



			let totalAmount = 0

			newOrder.products.forEach(prod => {
				console.log("FOUND PROD")
				
				let foundProduct = newOrder.productDetails.find(curr => curr._id.toString() == prod.productId)
				console.log(foundProduct)
				totalAmount += prod.amount * foundProduct.price
				console.log(totalAmount)
			})

			newOrder.totalAmount = totalAmount

			await newOrder.save()
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

module.exports.editProductQuantity = async (userId, index, quantity) => {
	try {
		const user = await User.findById(userId)
		let orderId = user.currentOrders
		const order = await Order.findById(orderId).populate('productDetails').exec()
		


		order.products[index].amount = quantity
		console.log("PRODUCT QUANTITY")
		console.log(order.products[index].amount)
		console.log(order.products)
		
		
		let totalAmount = 0
		order.products.forEach(prod => {
			let foundProduct = order.productDetails.find(curr => curr._id.toString() == prod.productId)
			totalAmount += prod.amount * foundProduct.price
		})

		order.totalAmount = totalAmount

		console.log('EDIT ORDER QUANTITY')
		console.log(order)

		await Order.findByIdAndUpdate(orderId, {products : order.products, totalAmount: totalAmount})
		// await order.save()


		return true
	}catch(err) {
		console.log(err)
		return false
	}
}


module.exports.deleteProductFromOrder = async (id, index) => {

	try {
		
		const user = await User.findById(id)
		const order = await Order.findById(user.currentOrders)
		const allProducts = await Product.find()

		let newProducts = order.products.filter((prod, i) => {return i != index})


		order.products = [...newProducts]

		let newProductDetails = order.productDetails.filter((prod,i) => {return i !== index})
		order.productDetails = [...newProductDetails]

		console.log("DELETING..")

		if (order.products.length == 0) {
			//delete order
			user.currentOrders = ""
			await Order.remove({_id : order._id})
			await user.save()
			return true
		}

		let totalAmount = 0

		order.products.forEach(prod => {
			let foundProduct = allProducts.find(curr => curr._id.toString() == prod.productId)
			totalAmount += prod.amount * foundProduct.price
		})

		order.totalAmount = totalAmount

		await order.save()
		return true
	}catch(err) {
		console.log(err)
		return false
	}
}

module.exports.payOrder = async (id) => {
	try {
		const user = await User.findById(id)


		if(user.currentOrders != "") {
			const order = await Order.findById(user.currentOrders) 

			order.deliveryStatus = 1

			await order.save()
			return true
		} else {
			return false
		}
		
	}catch(err) {
		console.log(err)
		return false
	}
}