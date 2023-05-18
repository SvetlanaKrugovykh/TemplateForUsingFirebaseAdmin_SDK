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
		method: 'GET',
		url: '/auth/list-all-users',
		handler: authController.listAllUsers,
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

	fastify.route({
		method: 'POST',
		url: '/auth/verify-token',
		handler: authController.verifyToken,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})

	done()
}
