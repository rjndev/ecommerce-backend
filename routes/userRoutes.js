const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/userControllers')
const auth = require('../middlewares/auth')

router.post('/register', (req,res)=> {
	userControllers.register(req.body).then(result => {
		if(result == "EA") {
			res.status(400).send("EA")
		} 
		else if(result) {
			res.send("OK")
		} else {
			res.status(500).send("ERROR")
		}
	})
})


router.post('/login', (req,res)=> {
	userControllers.login(req.body).then(result => {

		 if(!result) {
			res.status(400).send("WC")
		} else {
			res.send(result)
		}
	})
})



//ADMIN Protected Routes
router.get('/details/all', auth.verify, auth.verifyAdmin, (req,res)=> {
	userControllers.getAllUsers().then(result => {
		if(result) {
			res.send(result)
		} else {
			res.send("ERROR")
		}
	})
})

router.put('/:id/setAsAdmin', auth.verify, auth.verifyAdmin, (req,res) => {
	userControllers.setAsAdmin(req.params.id).then(result => {
		if(result) {
			res.send({result : "OK"})
		} else {
			res.status(500).send({result : "ERROR"})
		}
	})
})

module.exports = router