const dbRequestsController = require('../../controllers/db/dbRequests.controller')
// const isAuthorizedGuard = require('../../guards/is-authorized.guard')

module.exports = (fastify, _opts, done) => {

	fastify.route({
		method: 'GET',
		url: '/db-requests/list-collections',
		handler: dbRequestsController.listCollections,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})

	fastify.route({
		method: 'POST',
		url: '/db-requests/create-collection',
		handler: dbRequestsController.createCollection,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})

	fastify.route({
		method: 'GET',
		url: '/db-requests/get-collection-with-name',
		handler: dbRequestsController.getCollectionWithName,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})

	fastify.route({
		method: 'POST',
		url: '/db-requests/list-documents',
		handler: dbRequestsController.listDocumentsInCollection,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})

	fastify.route({
		method: 'POST',
		url: '/db-requests/create-document-in-collection',
		handler: dbRequestsController.createDocumentInCollection,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})

	fastify.route({
		method: 'POST',
		url: '/db-requests/update-document-in-collection',
		handler: dbRequestsController.updateDocumentInCollection,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})


	fastify.route({
		method: 'GET',
		url: '/db-requests/get-document-with-id',
		handler: dbRequestsController.getDocumentWithId,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})

	fastify.route({
		method: 'GET',
		url: '/db-requests/get-documents-with-filter',
		handler: dbRequestsController.getDocumentsWithFilter,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})


	fastify.route({
		method: 'POST',
		url: '/db-requests/delete-document-in-collection',
		handler: dbRequestsController.deleteDocumentInCollection,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})

	fastify.route({
		method: 'POST',
		url: '/db-requests/delete-collection',
		handler: dbRequestsController.deleteCollection,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})

	fastify.route({
		method: 'POST',
		url: '/db-requests/delete-database',
		handler: dbRequestsController.deleteDatabase,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})

	fastify.route({
		method: 'POST',
		url: '/db-requests/create-database',
		handler: dbRequestsController.createDatabase,
		// preHandler: [
		// 	isAuthorizedGuard
		// ]
	})





	done()
}
