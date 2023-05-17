const Firebase = require('../../../../../libs/firebase')
const HttpError = require('http-errors')

//#region create user
module.exports.createUser = async function (request, reply) {
	const { data } = request.body
	if (!data || !data.email || !data.password) {
		throw new Error('Invalid data');
	}
	console.dir(Firebase.admin)
	const firestoreAuth = Firebase.admin.auth();
	try {
		const userCredential = await firestoreAuth.createUser({
			email: data.email,
			password: data.password
		});
		const user = userCredential.UserRecord;
		console.dir(user)
		const uid = 'f';

		reply.send({ data: `User ${uid} created` });
	} catch (err) {
		if (err.code === 'auth/email-already-exists') {
			throw HttpError[409]('Email already exists');
		} else {
			console.log(err);
			throw HttpError.InternalServerError('Server error.')
		}
	}
};
//#endregion create user

//#region login
module.exports.loginUser = async function (request, reply) {
	const { data } = request.body;
	if (!data || !data.email || !data.password) {
		throw new Error('Invalid data');
	}
	const firestoreAuth = Firebase.admin.auth();
	try {
		const userRecord = await firestoreAuth.getUserByEmail(data.email);
		const verified = await verifyUserPassword(userRecord, data.password);
		if (!verified) {
			throw HttpError.Unauthorized('Invalid email or password');
		}
		const { uid, email } = userRecord;
		reply.send({ data: { uid, email } });
	} catch (err) {
		if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
			throw HttpError.Unauthorized('Invalid email or password');
		} else {
			console.log(err);
			throw HttpError.InternalServerError('Server error.');
		}
	}
};