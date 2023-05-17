const Firebase = require('../../../../../libs/firebase')
const HttpError = require('http-errors')

module.exports.createUser = async function (request, reply) {
	const { data } = request.body
	if (!data || !data.email || !data.password) {
		throw new Error('Invalid data');
	}
	console.dir(Firebase.admin)
	const firestoreAuth = Firebase.admin.auth();
	try {
		await firestoreAuth.createUser({
			email: data.email,
			password: data.password
		});

		reply.send({ data: 'User created' });
	} catch (err) {
		if (err.code === 'auth/email-already-exists') {
			throw HttpError[409]('Email already exists');
		} else {
			console.log(err);
			throw HttpError.InternalServerError('Server error.')
		}
	}
};
