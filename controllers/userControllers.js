const User = require('../models/User')
const bcrypt = require('bcrypt')
const auth = require('../middlewares/auth')

module.exports.register = (data) => {

	return User.findOne({email : data.email}).then(result => {
		//if there is existing email error

		if(result){
			return "EA"
		} else {
			//if none found proceed with register
			let newUser = new User({
				firstName : data.firstName,
				lastName : data.lastName,
				email : data.email,
				password : bcrypt.hashSync(data.password, 10)
			})

			return newUser.save().then(result => {
				return true
			}).catch(err => {
				return false
			})
		}
	})


	
}


module.exports.login = (user) => {
	return User.findOne({email : user.email}).then(result => {
		const isPasswordCorrect = bcrypt.compareSync(user.password, result.password)

		const data = {
			email : user.email,
			id : result._id,
			isAdmin : result.isAdmin
		}

		if(isPasswordCorrect) {
			return {auth : auth.createAccessToken(data)}
		}
	}).catch(err => {
		return false
	})
}

module.exports.getAllUsers = () => {
	return User.find({}).then(result => {
		return result
	}).catch(err => {
		return false
	})
}