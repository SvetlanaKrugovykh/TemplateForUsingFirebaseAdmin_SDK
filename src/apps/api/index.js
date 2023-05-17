const Fastify = require('fastify')
const fastifyCors = require('@fastify/cors')
const fastifyHelmet = require('@fastify/helmet')
const fastifySwagger = require('@fastify/swagger')
const fastifyMultipart = require('@fastify/multipart')

// Custom plugins
//////const authPlugin = require('./plugins/auth.plugin')

const { NODE_ENV, API_HOST } = process.env

const app = Fastify({
	logger: NODE_ENV === 'production' ? { level: 'error' } : true,
	trustProxy: true
})

app.register(fastifyHelmet, { global: true })

app.register(fastifyMultipart, {
	limits: {
		fieldNameSize: 100,
		fieldSize: 100,
		fields: 10,
		fileSize: 1000000,
		files: 1,
		headerPairs: 2000
	}
})

app.register(fastifyCors, {
	origin: '*',
	allowedHeaders: [
		'Origin',
		'X-Requested-With',
		'Accept',
		'Content-Type',
		'Authorization'
	],
	methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE']
})

app.register(fastifySwagger, {
	routePrefix: '/docs',
	swagger: {
		info: {
			title: 'Timesact Shopify',
			description: 'Documentation for Timesact Shopify API',
			version: '1.0.0'
		},
		host: API_HOST ? API_HOST.replace('http://', '').replace('https://', '') : 'localhost',
		schemes: ['http', 'https'],
		consumes: ['application/json'],
		produces: ['application/json'],
		tags: [],
		definitions: {},
		securityDefinitions: {
			apiKey: {
				type: 'apiKey',
				name: 'Authorization',
				description: 'Firebase Auth JWT',
				in: 'header'
			}
		}
	},
	uiConfig: {
		docExpansion: 'full',
		deepLinking: true
	},
	staticCSP: true,
	transformStaticCSP: (header) => header,
	exposeRoute: true,
	hideUntagged: true
})

// Register custom plugins
//////app.register(authPlugin)

// Register routes
app.get('/', () => {
	return { name: 'Timesact Shopify API' }
})

app.register(require('./http/routes/db/dbRequest.route'))
app.register(require('./http/routes/auth/auth.route'))

module.exports = app
