import express from 'express'
import auth from '../middlewares/auth.js'
import sellerController from '../controllers/sellerControllers.js'
import routeConstants from '../routeConstants.js'


const router = express.Router()


//route for checking if current seller has ownership of product
router.get('/authOwnership/:id' , async (req,res) => {

	try {
		const productId = req.params.id

		let token = req.headers.authorization
		token = token.slice(7, token.length)
		sellerId = auth.decode(token).id

		
		const result = await sellerController.authOwnership(sellerId, productId)

		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK})
		}
	}catch(err) {
		res.send(err)
	}
})

router.get('/productsFromOrder', auth.verifySeller, async (req,res) => {

	try{
		let token = req.headers.authorization
		token = token.slice(7, token.length)
		sellerId = auth.decode(token).id
		
		const result = await sellerController.getProductsFromOrder(sellerId)

		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK ,result})
		}
	}catch(err) {
		res.send(err)
	}
})


router.post('/create', async (req,res) => {

	try{
		const result = await sellerController.createSeller(req.body)

		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else if(result === "AE"){
			res.send({code : routeConstants.codeEXISTINGACCOUNT})
		} else {
			res.send({code : routeConstants.codeOK})
		}
	}catch(err) {
		res.send(err)
	}
})

router.post('/login', async (req,res) => {

	try{ 

		const result = await sellerController.login(req.body)

		if(!result || result == "CI") {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK ,result})
		}
	}catch(err) {
		res.send(err)
	}
})


router.get('/details', async (req,res) => {
	try {
		let token = req.headers.authorization
		token = token.slice(7, token.length)

		const result = await sellerController.getDetails(token)

		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK ,result})
		}

	}catch(err) {
		res.send(err)
	}
})


export default router