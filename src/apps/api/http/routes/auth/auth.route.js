const authController = require('../../controllers/auth/auth.controller');

module.exports = (fastify, _opts, done) => {

	fastify.route({
		method: 'POST',
		url: '/auth/create-user',
		handler: authController.createUser,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})

	done()
}
