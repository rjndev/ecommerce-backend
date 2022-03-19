const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const orderControllers = require('../controllers/orderControllers')


//*ADMIN Routes
router.get('/orders', auth.verify, auth.verifyAdmin, (req,res) => {
	orderControllers.getAllOrders().then(result => {
		if(!result) {
			res.status(500).send({result : "ERROR"})
		} else {
			res.send({result : result})
		}
	})
})


//*NON-ADMIN user Routes
router.post('/checkout', auth.verify, auth.verifyNotAdmin, (req,res)=> {
	let token = req.headers.authorization
	token = token.slice(7,token.length)
	const userId = auth.decode(token).id


	orderControllers.createOrder(userId, req.body).then(result => {
		if(!result) {
			res.status(500).send({result : "ERROR"})
		} else {
			res.send({result : "OK"})
		}
	})
})

router.post('/addToCart', auth.verify, auth.verifyNotAdmin, (req,res)=> {
	let token = req.headers.authorization
	token = token.slice(7,token.length)
	const userId = auth.decode(token).id

	orderControllers.addToCart(userId, req.body).then(result => {
		if(!result) {
			res.send({result : "ERROR"})
		} else {
			res.send({result : "OK"})
		}
	})
})


router.get('/myOrders', auth.verify, auth.verifyNotAdmin, (req,res) => {
	let token = req.headers.authorization
	token = token.slice(7,token.length)
	const userId = auth.decode(token).id

	orderControllers.getUserOrders(userId).then(result => {
		if(!result) {
			res.send({result : "ERROR"})
		} else {
			res.send({result : result})
		}
	})
})

router.delete('/myOrders/deleteProduct', auth.verify, (req,res) => {
	let token = req.headers.authorization
	token = token.slice(7,token.length)
	const userId = auth.decode(token).id

	orderControllers.deleteProductFromOrder(userId, req.body.index).then(result => {
		if(!result) {
			res.send({result : "ERROR"})
		} else {
			res.send({result : "OK"})
		}
	})
})

router.post('/myOrders/pay', auth.verify, (req,res) => {
	let token = req.headers.authorization
	token = token.slice(7,token.length)
	const userId = auth.decode(token).id

	orderControllers.payOrder(userId).then(result => {
		if(!result) {
			res.send({result : "ERROR"})
		} else {
			res.send({result : "OK"})
		}
	})
})

module.exports = router