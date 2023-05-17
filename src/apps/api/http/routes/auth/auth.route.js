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

	fastify.route({
		method: 'POST',
		url: '/auth/login-user',
		handler: authController.loginUser,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})

	done()
}
