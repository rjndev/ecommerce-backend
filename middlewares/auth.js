import jwt from 'jsonwebtoken'
import Seller from '../models/Seller.js'

const createAccessToken = (user) => {
	const data = {
		id : user.id,
		email : user.email,
		isAdmin : user.isAdmin
	}

	return jwt.sign(data, process.env.SECRET, {})
}



const verifySeller = async (req, res, next) => {
	let token = req.headers.authorization
	
	token = token.slice(7,token.length)
	let id = decode(token).id

	let foundSeller = await Seller.findById(id)

	if(foundSeller) {
		next()
	} else {
		return res.send({auth : "failed"})
	}
}

const verify = (req, res, next) => {
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

const decode = (token) => {

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

const verifyAdmin = (req,res,next) => {
	let token = req.headers.authorization
	token = token.slice(7, token.length)

	let data = module.exports.decode(token)

	if(data.isAdmin) {
		return next()
	} else {
		return res.status(400).send({auth : "failed NA"})
	}
}


const verifyNotAdmin = (req,res,next) => {
	let token = req.headers.authorization
	token = token.slice(7, token.length)

	let data = decode(token)

	if(!data.isAdmin) {
		return next()
	} else {
		return res.status(400).send({auth : "failed A"})
	}
}

export default {
	createAccessToken,
	verifySeller,
	verifyAdmin,
	verifyNotAdmin,
	decode,
	createAccessToken,
	verify
}