const e = require('express')
const Product = require('../models/Product')
const Category = require('../models/Category')
const Seller = require('../models/Seller')
const mongoose = require('mongoose')



module.exports.createProduct = async (sellerId, body) => {

	try {
		let sameProduct = await Product.findOne({name : body.name})
		const allCategories = await Category.find()


		if(sameProduct == null) {
			//no same product name
			let newProduct = new Product({
				name : body.name,
				description : body.description,
				price : body.price,
				categories  : [...body.categories],
				rating : 0,
				imagePath : body.imagePath,
				seller : mongoose.Types.ObjectId(sellerId)
			})

			let foundCategory
			//add product to category
			body.categories.forEach(cat => {
				foundCategory = allCategories.find(current => current.name == cat.name )
				foundCategory.products.push(newProduct._id)
			})

			console.log("FOUND CATEGORY")
			console.log(foundCategory)
			console.log(newProduct)

			//add product to Seller
			let foundSeller = await Seller.findById(sellerId)
			foundSeller.products.push(newProduct._id)

			
			await newProduct.save()
			await foundCategory.save()
			await foundSeller.save()
			return true

		} else {
			return false
		}


	}catch(err) {
		console.log(err)
		return {error : "ERROR"}
	}
}


module.exports.getProduct = async (id) => {
	try {
		let foundProduct = await Product.findById(id).populate('seller').exec()

		return foundProduct
	}catch(err) {
		return false
	}
}

module.exports.getAllProducts = async ()=> {
	try {
		let products =  await Product.find().populate('seller').exec()
		return products
	}catch(err) {
		console.log(err)
		return false
	}
}

module.exports.getActiveProducts = async () => {
	try {
		let activeProducts = await Product.find({isActive : true}).populate('seller').exec()

		return activeProducts
	}catch(err) {
		console.log("ERROR ACTIVE")
		console.log(err)
		return false
	}
}


module.exports.updateProduct = async (id, body) => {
	try {
		let foundProduct = await Product.findById(id)
		if(foundProduct == null) {
			return false
		} else {
			
			foundProduct.name = body.name
			foundProduct.description = body.description
			foundProduct.price = body.price
			foundProduct.isActive = body.isActive
			foundProduct.rating = body.rating,
			foundProduct.categories = [...body.categories]
			foundProduct.seller = mongoose.Types.ObjectId(body.sellerId)
			return await foundProduct.save()
		}
	}catch(err) {
		return false
	}
} 


module.exports.archiveProduct = async (id) => {
	try {
		let foundProduct = await Product.findById(id)

		if(foundProduct == null) {
			return false
		}else {
			foundProduct.isActive = false

			return await foundProduct.save()
		}
	} catch(err) {
		console.log(err);
		return false
	}
}

module.exports.getCategory = async (body) => {
	try {
		const foundCategory = await Category.find({name : body.name})

		return foundCategory

	}catch(err) {
		console.log(err)
		return false
	}
}

module.exports.getAllCategories = async () => {
	try {
		const allCategories = await Category.find()

		return allCategories
	}catch(err) {
		console.log(err);
		return false
	}
}

module.exports.getProductsInCategory = async (body) => {
	try {
		let products =[]

		const foundCategory = await Category.findOne({name : body.name}).populate('products').exec()
		console.log("FOUND CATEGORYYYYYY")
		console.log(foundCategory)
		products = [...foundCategory.products]

		return products
	}catch(err) {
		console.log(err)
		return false
	}
}