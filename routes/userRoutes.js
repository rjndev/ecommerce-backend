const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/userControllers')
const auth = require('../middlewares/auth')

router.post('/register', (req,res)=> {
	userControllers.register(req.body).then(result => {
		if(result == "EA") {
			res.send({result : "EA"})
		} 
		else if(result) {
			res.send({result : "OK"})
		} else {
			res.send({result : "ERROR"})
		}
	})
})


router.post('/login', (req,res)=> {
	userControllers.login(req.body).then(result => {

		 if(!result) {
			res.send({result : "WC"})
		} else {
			res.send({result: result})
		}
	})
})



//ADMIN Protected Routes
router.get('/details/all', auth.verify, auth.verifyAdmin, (req,res)=> {
	userControllers.getAllUsers().then(result => {
		if(result) {
			res.send({result : result})
		} else {
			res.send({result : "ERROR"})
		}
	})
})

router.get('/details', auth.verify , (req,res) => {
	let token = req.headers.authorization
	token = token.slice(7, token.length)

	userControllers.getUserDetails(token).then(result => {
		if(!result) {
			res.send({result : "ERROR"})
		} else {
			res.send({result: result})
		}
	})
})

router.get('/verifyLoggedIn', auth.verify, (req,res) => {
	res.send({auth : "VERIFIED"})
})


router.put('/:id/setAsAdmin', auth.verify, auth.verifyAdmin, (req,res) => {
	userControllers.setAsAdmin(req.params.id).then(result => {
		if(result) {
			res.send({result : "OK"})
		} else {
			res.send({result : "ERROR"})
		}
	})
})

module.exports = router