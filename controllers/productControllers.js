const e = require('express')
const Product = require('../models/Product')
const Category = require('../models/Category')



module.exports.createProduct = async (body) => {
	

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
				rating : body.rating
			})

			let foundCategory
			//add product to category
			body.categories.forEach(cat => {
				foundCategory = allCategories.find(current => current.name == cat.name )
				foundCategory.products.push({productId : newProduct._id})
			})

			console.log("FOUND CATEGORY")
			console.log(foundCategory)
			console.log(newProduct)

			
			await newProduct.save()
			await foundCategory.save()
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
		let foundProduct = await Product.findById(id)

		return foundProduct
	}catch(err) {
		return false
	}
}

module.exports.getAllProducts = async ()=> {
	try {
		let products = await Product.find()
		return products
	}catch(err) {
		console.log(err)
		return false
	}
}

module.exports.getActiveProducts = async () => {
	try {
		let activeProducts = await Product.find({isActive : true})

		return activeProducts
	}catch(err) {
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
		return false
	}
}