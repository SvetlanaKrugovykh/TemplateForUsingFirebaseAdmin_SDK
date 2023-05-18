const Firebase = require('../../../../../libs/firebase')
const HttpError = require('http-errors')

//#region create user
module.exports.createUser = async function (request, reply) {
	const { data } = request.body
	if (!data || !data.email || !data.password) {
		throw new Error('Invalid data')
	}
	console.dir(Firebase.admin)
	const firebaseAuth = Firebase.admin.auth()
	try {
		const userCredential = await firebaseAuth.createUser({
			email: data.email,
			password: data.password
		})
		const uid = userCredential.uid
		reply.send({ data: `User ${uid} created` })
	} catch (err) {
		if (err.code === 'auth/email-already-exists') {
			throw HttpError[409]('Email already exists')
		} else {
			console.log(err)
			throw HttpError.InternalServerError('Server error.')
		}
	}
}
//#endregion create user

//#region list all users
module.exports.listAllUsers = async function (request, reply) {
	const firebaseAuth = Firebase.admin.auth()
	try {
		const listUsersResult = await firebaseAuth.listUsers()
		const users = listUsersResult.users.map((userRecord) => {
			const { uid, email } = userRecord
			return { uid, email }
		})
		reply.send({ data: users })
	} catch (err) {
		console.log(err)
		throw HttpError.InternalServerError('Server error.')
	}
}
//#endregion list all users

//#region login-user
module.exports.loginUser = async function (request, reply) {
	const { data } = request.body
	if (!data || !data.email || !data.password) {
		throw new Error('Invalid data')
	}
	const firebaseAuth = Firebase.admin.auth()
	try {
		const user = await firebaseAuth.getUserByEmail(data.email)
		const idToken = await firebaseAuth.createCustomToken(user.uid)
		reply.send({ data: idToken })
	} catch (err) {
		if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
			throw HttpError.Unauthorized('Invalid email or password')
		} else {
			console.log(err)
			throw HttpError.InternalServerError('Server error.')
		}
	}
}
//#endregion login-user


//#region verify-token
module.exports.verifyToken = async function (request, reply) {
	const { data } = request.body
	if (!data) {
		throw new Error('Invalid data')
	}
	const firebaseAuth = Firebase.admin.auth()
	try {
		const token = await firebaseAuth.verifyIdToken(data)
		console.log(token)
		reply.send({ data: token.uid, message: `Token is valid for ${token.email}` })
	} catch (err) {
		if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
			throw HttpError.Unauthorized('Invalid email or password')
		} else {
			console.log(err)
			throw HttpError.InternalServerError('Server error.')
		}
	}
}
//#endregion verify-token
