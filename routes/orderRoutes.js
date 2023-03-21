import express from 'express'
import auth from '../middlewares/auth.js'
import orderControllers from '../controllers/orderControllers.js'
import routeConstants from '../routeConstants.js'


const router = express.Router()


//*ADMIN Routes
router.get('/orders', auth.verify, auth.verifyAdmin, async (req,res) => {
	try {
		const result = await orderControllers.getAllOrders()
		if(!result) {
			res.status(500).send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK , result})
		}
	}catch(err) {
		res.send(err)
	}

	
})


//*NON-ADMIN user Routes
router.post('/checkout', auth.verify, auth.verifyNotAdmin, async (req,res)=> {

	try {
		let token = req.headers.authorization
		token = token.slice(7,token.length)
		const userId = auth.decode(token).id


		const result = await orderControllers.createOrder(userId, req.body)


		if(!result) {
			res.status(500).send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK, result})
		}
	}catch(err) {
		res.send(err)
	}
})

router.post('/payCart', auth.verify, auth.verifyNotAdmin, async (req,res ) => {

	try {
		let token = req.headers.authorization
		token = token.slice(7,token.length)
		const userId = auth.decode(token).id

		const result = await orderControllers.payOrder2(userId, req.body.orderId)
		console.log("RESULT IS")
		console.log(result)
		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK})
		}
	}catch(err) {
		res.send(err)
	}	
})

router.post('/addToCart', auth.verify, auth.verifyNotAdmin, async (req,res)=> {

	try {
		let token = req.headers.authorization
		token = token.slice(7,token.length)
		const userId = auth.decode(token).id

		const result = await orderControllers.addToCart(userId, req.body)
		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK})
		}

	}catch(err) {
		res.send(err)
	}
})


router.get('/myOrders', auth.verify, auth.verifyNotAdmin, async (req,res) => {
	
	try {
		let token = req.headers.authorization
		token = token.slice(7,token.length)
		const userId = auth.decode(token).id

		console.log('sending orders!')
		const result = await orderControllers.getUserOrders(userId)
		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK , result})
		}
	}catch(err) {
		res.send(err)
	}
})

router.put('/myOrders/editProductQuantity', auth.verify, async (req,res) => {

	try {
		let token = req.headers.authorization
		token = token.slice(7, token.length)

		const userId = auth.decode(token).id

		const result = await orderControllers.editProductQuantity(userId, req.body.index, req.body.quantity)

		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK})
		}
	}catch(err) {
		res.send(err)
	}
})

router.delete('/myOrders/deleteProduct', auth.verify, async (req,res) => {

	try {
		let token = req.headers.authorization
		token = token.slice(7,token.length)
		const userId = auth.decode(token).id

		const result = await orderControllers.deleteProductFromOrder(userId, req.body.index)

		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK , result})
		}
	}catch(err) {
		res.send(err)
	}
})

router.post('/myOrders/pay', auth.verify, async (req,res) => {

	try {
		let token = req.headers.authorization
		token = token.slice(7,token.length)
		const userId = auth.decode(token).id

		const result = await orderControllers.payOrder(userId)

		if(!result) {
			res.send({code : routeConstants.codeOK})
		} else {
			res.send({ code : routeConstants.codeOK ,result})
		}
	}catch(err) {
		res.send(err)
	}
})

export default router