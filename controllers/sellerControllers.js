const Seller = require('../models/Seller')
const Product = require('../models/Product')
const bcrypt = require('bcrypt')
const auth = require('../middlewares/auth')


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
			if (foundProduct.sellerId == sellerId) {
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

		const seller = await Seller.findById(authPayload.id)

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