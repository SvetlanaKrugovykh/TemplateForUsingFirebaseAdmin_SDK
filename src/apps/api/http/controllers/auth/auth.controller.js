const Firebase = require('../../../../../libs/firebase')
const HttpError = require('http-errors')
const fs = require('fs');

const jwt = require('jsonwebtoken');
const NodeRSA = require('node-rsa');

const serviceAccount = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS));
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
		console.log(user.uid)
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

	const { authorization } = request.headers
	if (!authorization) {
		throw new Error('Invalid data')
	}
	try {
		const firebaseAuth = Firebase.admin.auth()
		const publicKey = new NodeRSA().importKey(serviceAccount.private_key, 'pkcs8-private-pem').exportKey('pkcs8-public-pem')
		const decodedToken = jwt.verify(authorization, publicKey)
		console.log('decodedToken', decodedToken)
		const user = await firebaseAuth.getUser(decodedToken.uid)
		console.log('user', user)

		// const user = await firebaseAuth.verifyIdToken(idToken)
		// reply.send({ data: user.uid, message: `Token is valid for ${user.email}` })

		reply.send({ data: decodedToken.uid, message: `Token is valid for ${decodedToken.uid}, ${user.email}` });


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
