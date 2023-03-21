import User from '../models/User.js'
import bcrypt from 'bcrypt'
import auth from '../middlewares/auth.js'

const register = async (data) => {

	try {
		const result = await User.findOne({email : data.email})

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

	}catch(err) {
		return false
	}
	
	
}


const login = async (user) => {

	try {
		const result =  await User.findOne({email : user.email})

		const isPasswordCorrect = bcrypt.compareSync(user.password, result.password)

		const data = {
			email : user.email,
			id : result._id,
			isAdmin : result.isAdmin
		}

		if(isPasswordCorrect) {
			return {auth : auth.createAccessToken(data)}
	}
	}catch(err) {
		return false
	}

	
}
const getAllUsers = async () => {

	try {
		const result = await User.find({})
		return result
	}catch(err) {
		return false
	}

	
}

const getUserDetails = async (token) => {
	const authPayload = auth.decode(token)

	try {
		const user = await User.findOne({email : authPayload.email})

		return user
	}catch(err) {
		console.log(err)
		return false
	}
}


const setAsAdmin = async (id) => {

	try {
		let result = await User.findByIdAndUpdate({_id : id}, {isAdmin : true})
		
		return true
	}catch(err) {
		return false
	}

}

export default {
	setAsAdmin,
	getUserDetails,
	getAllUsers,
	login,
	register
}