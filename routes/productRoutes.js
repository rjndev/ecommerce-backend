const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const productControllers = require('../controllers/productControllers')

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



module.exports = router