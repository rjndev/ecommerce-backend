const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const productControllers = require('../controllers/productControllers')




//*ADMIN Protected Routes
//Create a new Product Route
router.post('/create', auth.verify, auth.verifySeller, (req,res)=> {
	
	let token = req.headers.authorization
	token = token.slice(7,token.length)

	let sellerId = auth.decode(token).id
	productControllers.createProduct(sellerId, req.body).then(result => {
		if(result?.error) {
			res.status(400).send("ERROR")
		} else if(result == false){
			res.status(400).send({result : "EP"})
		} else {
			res.send({result : "OK"})
		}
	})
})

//GET all product details including non active
router.get('/details/all', auth.verify, auth.verifyAdmin, (req,res)=> {
	productControllers.getAllProducts().then(result => {
		if(!result) {
			res.send({result : "failed"})
		} else {
			res.send({result : result})
		}
	})
})

//UPDATE product information
router.put('/details/:id/update', auth.verify, auth.verifyAdmin, (req,res)=>{ 
	productControllers.updateProduct(req.params.id, req.body).then(result=> {

		if(!result) {
			res.status(500).send({result : "failed"})
		} else {
			res.send({result : "OK"})
		}
	})
})

router.put('/details/:id/archive', auth.verify, auth.verifyAdmin, (req,res) => {
	productControllers.archiveProduct(req.params.id).then(result => {
		if(!result) {
			res.status(500).send({result : "failed"})
		} else {
			res.send({result : "OK"})
		}
	})
})



//*NON PROTECTED


router.get('/details/active', (req,res)=> {
	productControllers.getActiveProducts().then(result => {
		if(!result) {
			res.send({result : "failedezzz"})
		} else {
			res.send({result : result})
		}
	})
})

router.get('/categories/category', (req,res) => {
	productControllers.getCategory(req.body).then(result => {
		if(!result) {
			res.status(500).send({result : "failed"})
		} else {
			res.send({result : result})
		}
	})
})

router.get('/categories/all' , (req,res) => {
	productControllers.getAllCategories().then(result => {
		if(!result) {
			res.status(500).send({result : "failed"})
		} else {
			res.send({result : result})
		}
	})
})

router.get('/categories/:name', (req,res) => {
	productControllers.getProductsInCategory({name: req.params.name}).then(result => {
		if(!result) {
			res.send({result : "failed"})
		} else {
			res.send({result : result})
		}
	})
})

router.get('/details/:id', (req,res) => {
	productControllers.getProduct(req.params.id).then(result => {
		if(!result) {
			res.send({result : "failed"})
		}else {
			res.send({result : result})
		}
	})
})

module.exports = router