const Product = require('../models/Product')

module.exports.createProduct = async (body) => {
	
	try {
		let sameProduct = await Product.findOne({name : body.name})
		if(sameProduct == null) {
			//no same product name
			console.log("NO SAME PRODUCT")
			let newProduct = new Product({
				name : body.name,
				description : body.description,
				price : body.price,
			})

			await newProduct.save()


		} else {
			console.log("SAME PRODUCT")
			return false
		}


	}catch(err) {
		console.log(err)
		return {error : "ERROR"}
	}
	
	
	
}