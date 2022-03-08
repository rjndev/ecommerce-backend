const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/userControllers')
const auth = require('../middlewares/auth')

router.post('/register', (req,res)=> {
	userControllers.register(req.body).then(result => {
		if(result) {
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

router.get('/details/all', auth.verify, auth.verifyAdmin, (req,res)=> {
	userControllers.getAllUsers().then(result => {
		if(result) {
			res.send(result)
		} else {
			res.send("ERROR")
		}
	})
})

module.exports = router