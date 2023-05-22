const productsController = require('../../controllers/shopify/products.controller')
// const isAuthorizedGuard = require('../../guards/is-authorized.guard')

module.exports = (fastify, _opts, done) => {

	fastify.route({
		method: 'POST',
		url: '/shopify/product-create',
		handler: productsController.createProduct,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})
	done()
}