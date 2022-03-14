const jwt = require('jsonwebtoken')


module.exports.createAccessToken = (user) => {
	const data = {
		id : user.id,
		email : user.email,
		isAdmin : user.isAdmin
	}

	return jwt.sign(data, process.env.SECRET, {})
}

module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization

	if(typeof token !== "undefined") {
		token = token.slice(7, token.length)
		

		return jwt.verify(token, process.env.SECRET, (err, result)=> {
			if(err) {
				return res.send({auth : "failed"})
			} else {
				return next()
			}
		})
	} else {
		return res.send({auth : "failed"})
	}
}

module.exports.decode = (token) => {

	if(typeof token !== "undefined") {

		return jwt.verify(token, process.env.SECRET, (err, result) => {
			if(err) {
				return false
			} else {
				return result
			}
		})
	} else {
		return false
	}
}

module.exports.verifyAdmin = (req,res,next) => {
	let token = req.headers.authorization
	token = token.slice(7, token.length)

	let data = module.exports.decode(token)

	if(data.isAdmin) {
		return next()
	} else {
		return res.status(400).send({auth : "failed NA"})
	}
}


module.exports.verifyNotAdmin = (req,res,next) => {
	let token = req.headers.authorization
	token = token.slice(7, token.length)

	let data = module.exports.decode(token)

	if(!data.isAdmin) {
		return next()
	} else {
		return res.status(400).send({auth : "failed A"})
	}
}