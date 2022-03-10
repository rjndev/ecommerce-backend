const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const productControllers = require('../controllers/productControllers')




//*ADMIN Protected Routes
//Create a new Product Route
router.post('/create', auth.verify, auth.verifyAdmin, (req,res)=> {
	productControllers.createProduct(req.body).then(result => {
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
			res.status(500).send({result : "failed"})
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
router.get('/details/:id', (req,res) => {
	productControllers.getProduct(req.params.id).then(result => {
		if(!result) {
			res.status(500).send({result : "failed"})
		}else {
			res.send({result : result})
		}
	})
})

router.get('details/active', (req,res)=> {
	productControllers.getActiveProducts().then(result => {
		if(!result) {
			res.status(500).send({result : "failed"})
		} else {
			res.send({result : result})
		}
	})
})


module.exports = router