import express from 'express'
import userControllers from '../controllers/userControllers.js'
import auth from '../middlewares/auth.js'
import routeConstants from '../routeConstants.js'


const router = express.Router()

router.post('/register', async (req,res)=> {

	try {
		
		const result = await userControllers.register(req.body)

		if(result == "EA") {
			res.send({code : routeConstants.codeEXISTINGACCOUNT})
		} 
		else if(result) {
			res.send({code : routeConstants.codeOK})
		} else {
			res.send({code : routeConstants.codeERROR})
		}
	} catch(err) {
		res.send(err)
	}

})


router.post('/login', async (req,res)=> {
	try { 
		const result = await userControllers.login(req.body)
		
		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK ,result})
		}
	}catch(err) {
		res.send(err)
	}
})



//ADMIN Protected Routes
router.get('/details/all', auth.verify, auth.verifyAdmin, async (req,res)=> {
	try {
		const result = await userControllers.getAllUsers()

		if(result) {
			res.send({code : routeConstants.codeOK ,result})
		} else {
			res.send({code : routeConstants.codeERROR})
		}
	}catch(err) {
		res.send(err)
	}	
})

router.get('/details', auth.verify , async (req,res) => {
	try {
		let token = req.headers.authorization
		token = token.slice(7, token.length)
		let result = await userControllers.getUserDetails(token)
		if(!result) {
			res.send({code : routeConstants.codeERROR})
		} else {
			res.send({code : routeConstants.codeOK ,result})
		}
	}catch(err) {
		res.send(err)
	}
})

router.get('/verifyLoggedIn', auth.verify, (req,res) => {
	res.send({code : routeConstants.codeVERIFIED})
})

router.get('/verifyAdmin', auth.verify, auth.verifyAdmin, (req,res) => {
	res.send({code : routeConstants.codeVERIFIED})
})


router.put('/:id/setAsAdmin', auth.verify, auth.verifyAdmin, async (req,res) => {
	try {
		const result = await userControllers.setAsAdmin(req.params.id)
		
		if(result) {
			res.send({code : routeConstants.codeOK})
		} else {
			res.send({code : routeConstants.codeERROR})
		}
	}catch(err) {
		res.send(err)
	}
})

// module.exports = router
export default router