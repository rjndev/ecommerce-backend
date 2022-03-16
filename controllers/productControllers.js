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
				rating : body.rating,
				imagePath : body.imagePath
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
		const foundCategory = await Category.findOne({name : body.name})
		const allProducts = await Product.find({isActive : true})
		console.log("BODY")
		console.log(body)
		let products = []

		foundCategory.products.forEach(product => {
			let curProduct = allProducts.find(curr => curr._id.toString() == product.productId)
			if (curProduct != null)
				products.push(curProduct)
		})

		return products
	}catch(err) {
		console.log(err)
		return false
	}
}