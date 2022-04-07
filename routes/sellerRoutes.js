const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const sellerController = require('../controllers/sellerControllers')


//route for checking if current seller has ownership of product
router.get('/authOwnership/:id' , (req,res) => {
	const productId = req.params.id

	let token = req.headers.authorization
	token = token.slice(7, token.length)
	sellerId = auth.decode(token).id
	sellerController.authOwnership(sellerId, productId).then(result => {
		if(!result) {
			res.send({result : "ERR"})
		} else {
			res.send({result : "OK"})
		}
	})
})


router.post('/create', (req,res) => {
	sellerController.createSeller(req.body).then(result => {
		if(!result) {
			res.send({result : "Failed"})
		} else {
			res.send({result : "OK"})
		}
	})
})

router.post('/login', (req,res) => {
	sellerController.login(req.body).then(result => {
		if(!result || result == "CI") {
			res.send({result : "WC"})
		} else {
			res.send({result : result})
		}
	})
})


router.get('/details', (req,res) => {
	let token = req.headers.authorization
	token = token.slice(7, token.length)

	sellerController.getDetails(token).then(result => {
		if(!result) {
			res.send({result : "NF"})
		} else {
			res.send({result : result})
		}
	})
})


module.exports = router