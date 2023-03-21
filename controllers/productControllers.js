import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Seller from '../models/Seller.js'
import e from 'express'
import Order from '../models/Order.js'
import mongoose from 'mongoose'

const createProduct = async (sellerId, body) => {

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

const getRandomProducts = async (size) => {
	try {
		const res = await Product.aggregate().sample(size)

		console.log(res)
		return res
	}catch(err) {
		console.log(err)
		return false
	}
}

const searchProduct = async (searchText) => {
	try {
		let foundProducts = await Product.find({"name" : {"$regex" : searchText , "$options" : "i"}})

		return foundProducts

	} catch(err) {
		return false
	}


}


const getProduct = async (id) => {
	try {
		let foundProduct = await Product.findById(id).populate('seller').exec()

		return foundProduct
	}catch(err) {
		return false
	}
}

const getAllProducts = async ()=> {
	try {
		let products =  await Product.find().populate('seller').exec()
		return products
	}catch(err) {
		console.log(err)
		return false
	}
}

const getActiveProducts = async () => {
	try {
		let activeProducts = await Product.find({isActive : true}).populate('seller').exec()

		return activeProducts
	}catch(err) {
		console.log("ERROR ACTIVE")
		console.log(err)
		return false
	}
}

const updateAllOrderAmounts = async (productId) => {
	try {
		const ordersInvolved = await Order.find({productDetails : mongoose.Types.ObjectId(productId)}).populate('productDetails').exec()

		console.log("ORDERS INVOLVEDZZZ")
		console.log(ordersInvolved)

		ordersInvolved.forEach((order) => {
			let total = 0
			order.products.map((product, i) => {
				total += product.amount * order.productDetails[i].price
			})
			order.totalAmount = total
			console.log("TOTAL AMOUNT")
			console.log(total)
		})

		for(let i = 0; i < ordersInvolved.length; i++) {
			await ordersInvolved[i].save()
		}

		console.log("NEW ORDERS INVOLVEDZZZ")
		console.log(ordersInvolved)

		return true


	}catch(err) {
		console.log(err)
		return false
	}

}

const updateProduct = async (id, body, sellerId) => {
	try {
		let foundProduct = await Product.findById(id)
		if(foundProduct == null) {
			return false
		} else {
			
			foundProduct.name = body.name
			foundProduct.description = body.description
			foundProduct.price = body.price
			foundProduct.isActive =true 
			foundProduct.rating = 0,
			foundProduct.categories = [...body.categories]
			foundProduct.seller = mongoose.Types.ObjectId(sellerId)

			await foundProduct.save()

			const ordersInvolved = await updateAllOrderAmounts(foundProduct._id.toString())
			return ordersInvolved
			// return await foundProduct.save()
		}
	}catch(err) {
		return false
	}
} 


const archiveProduct = async (id) => {
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

const getCategory = async (body) => {
	try {
		const foundCategory = await Category.find({name : body.name})

		return foundCategory

	}catch(err) {
		console.log(err)
		return false
	}
}

const getAllCategories = async () => {
	try {
		const allCategories = await Category.find()

		return allCategories
	}catch(err) {
		console.log(err);
		return false
	}
}

const getProductsInCategory = async (body) => {
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

export default {
	getProductsInCategory,
	getAllCategories,
	getCategory,
	archiveProduct,
	updateProduct,
	updateAllOrderAmounts,
	getActiveProducts,
	getAllProducts,
	getProduct,
	searchProduct,
	getRandomProducts,
	createProduct,
}