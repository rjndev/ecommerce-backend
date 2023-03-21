import express from 'express'
import auth from '../middlewares/auth.js'
import productControllers from '../controllers/productControllers.js'
import sellerController from '../controllers/sellerControllers.js'
import routeConstants from '../routeConstants.js'


const router = express.Router()

//*ADMIN Protected Routes
//Create a new Product Route
router.post('/create', auth.verify, auth.verifySeller, async (req,res)=> {
	
	try {
		let token = req.headers.authorization
		token = token.slice(7,token.length)

		let sellerId = auth.decode(token).id

		const result = await productControllers.createProduct(sellerId, req.body)

		if(result?.error) {
			res.send({code : routeConstants.codeERROR})
		} else if(result == false){
			res.send({code : routeConstants.codeEXISTINGPRODUCT})
		} else {
			res.send({code : routeConstants.codeOK})
		}
	} catch(err) {
		res.send(err)
	}
})

//GET all product details including non active
router.get('/details/all', auth.verify, auth.verifyAdmin, async (req,res)=> {

	try {
		const result = await productControllers.getAllProducts()

		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({ code : routeConstants.codeOK ,result })
		}
	}catch(err){
		res.send(err)
	}
})

router.post('/details/random', async (req, res) => {

	try{ 
		const result = await productControllers.getRandomProducts(req.body.size)

		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK ,result})
		}
	} catch(err) {
		res.send(err)
	}
})

router.get('/search/:searchText', async (req, res) => {

	try{
		const result = await productControllers.searchProduct(req.params.searchText)

		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK ,result})
		}
	}catch(err) {
		res.send(err)
	}
}) 

//UPDATE product information
router.put('/details/:id/update', auth.verify, auth.verifySeller, async (req,res)=>{ 

	try{
		let token = req.headers.authorization
		token = token.slice(7,token.length)
		sellerId = auth.decode(token).id

		const result = await sellerController.authOwnership(sellerId, req.params.id)


		if(!result) {
			res.send({code : routeConstants.codeFAILEDAUTH})
		} else {
			productControllers.updateProduct(req.params.id, req.body, sellerId).then(result2=> {

				if(!result2) {
					res.status(500).send({code : routeConstants.codeERROR})
				} else {
					res.send({code : routeConstants.codeOK})
				}
			})
		}
	}catch(err) {
		res.send(err)
	}
})

router.put('/details/:id/archive', auth.verify, auth.verifyAdmin, async (req,res) => {
	try {
		const result = await productControllers.archiveProduct(req.params.id)

		if(!result) {
			res.status(500).send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK , result})
		}
	}catch(err) {
		res.send(err)
	}
})



//*NON PROTECTED


router.get('/details/active', async (req,res)=> {
	try{
		const result = await productControllers.getActiveProducts()

		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK ,result})
		}
	}catch(err) {
		res.send(err)
	}
})

router.get('/categories/category', async (req,res) => {
	try{
		const result = await productControllers.getCategory(req.body)
		if(!result) {
			res.status(500).send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.OK ,result})
		}
	}catch(err) {
		res.send(err)
	}
})

router.get('/categories/all' , async (req,res) => {
	try{
		const result = await productControllers.getAllCategories()

		if(!result) {
			res.status(500).send({code : routeConstants.codeERROR})
		} else {
			res.send({code: routeConstants.codeOK , result})
		}
	}catch(err) {
		res.send(err)
	}
})

router.get('/categories/:name', async (req,res) => {
	try {
		const result = await productControllers.getProductsInCategory({name: req.params.name})
		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK ,result})
		}
	}catch(err) {
		res.send(err)
	}
})

router.get('/details/:id', async (req,res) => {
	try {
		const result = await productControllers.getProduct(req.params.id)
		if(!result) {
			res.send({code : routeConstants.codeERROR})
		}else {
			res.send({code : routeConstants.codeOK ,result})
		}
	}catch(err) {
		res.send(err)
	}
})

export default router