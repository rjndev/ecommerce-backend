const Seller = require('../models/Seller')
const Product = require('../models/Product')
const bcrypt = require('bcrypt')
const auth = require('../middlewares/auth')
const Order = require('../models/Order')


const hasDuplicate = (id, orders) => {

	for(let i = 0; i < orders.length; i++) {
		if(id == orders[i]._id.toString()) {
			return true
		}
	}

	return false
}

module.exports.getProductsFromOrder = async(sellerId) => {
	try { 

		const seller = await Seller.findById(sellerId).populate('products').exec()
		
		const ordersInvolved = []
		const allOrdersWithDetails = []


		for(let i = 0; i < seller.products.length; i++) {
			console.log("FINDING ORDER...")
			let orderFound = await Order.findOne({productDetails : seller.products[i]})
			
		
			if(orderFound != null && !hasDuplicate(orderFound._id.toString(), ordersInvolved)) {
				
				console.log("ORDER FOUND")
				console.log(orderFound)
				ordersInvolved.push(orderFound)
			}
			
		}

		console.log("ORDERS INVOLVED")
		console.log(ordersInvolved)

		ordersInvolved.forEach(order => {
			let productsInvolved = []
			order.products.forEach(product => {
				let checkOwnProduct = seller.products.find(curr => curr._id.toString() == product.productId)
				
				if(checkOwnProduct != undefined) {
					productsInvolved.push({product : checkOwnProduct, amount : product.amount})
				}
			})

			allOrdersWithDetails.push({
				order : order,
				productsInvolved : productsInvolved
			})
		})
		

		console.log("ALLORDERS WITH DETAILS")
		console.log(allOrdersWithDetails)
		return allOrdersWithDetails

	} catch(err) {
		console.log(err)
		return false
	}
}


module.exports.getProducts = async (sellerId) => {
	try {
		let foundSeller = await Seller.findById(sellerId).populate('products').exec()
		

		return foundSeller.products

	}catch(err) {
		console.log(err)
		return false
	}
}


module.exports.authOwnership = async (sellerId, productId) => {
	try {
		const foundProduct = await Product.findById(productId)

		if(foundProduct) {
			if (foundProduct.seller.toString() == sellerId) {
				return true
			} else {
				return false
			}
		} else {
			return false
		}
	}catch(err) {
		console.log(err) 
		return false
	}
}

module.exports.getDetails = async (token) => {
	try { 
		const authPayload = auth.decode(token)

		const seller = await Seller.findById(authPayload.id).populate('products').exec()


		return seller
	}catch(err) {
		console.log(err)
		return false
	}
}

module.exports.login = async (body) => {
	try {
		const result = await Seller.findOne({email : body.email})

		if(result) {
			const isPasswordCorrect = bcrypt.compareSync(body.password, result.password)

			const data = {
				email : body.email,
				id : result._id,
			}

			if(isPasswordCorrect) {
				return {auth : auth.createAccessToken(data)}
			} else {
				//credentials incorrect
				return "CI"
			}

		} else {
			//credentials incorrect
			return "CI"
		}
	}catch(err) {
		console.log(err)
		return false
	}
}

module.exports.createSeller = async (body) => {
	try {
		const resultEmail = await Seller.findOne({email : body.email})
		const resultName = await Seller.findOne({storeName : body.storeName})
		
		if(resultEmail || resultName) {
			//return Account Exists 
			return "AE"
		} else {
			let newSeller = new Seller({
				storeName : body.storeName,
				email : body.email,
				password : bcrypt.hashSync(body.password, 10),
			})

			await newSeller.save()
			return true
		}
	
	}catch(err) {
		console.log(err)
		return false
	}
}