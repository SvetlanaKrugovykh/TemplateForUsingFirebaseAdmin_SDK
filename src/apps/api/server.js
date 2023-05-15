require('yamlenv').config()

const app = require('./index')

app.listen({ port: process.env.PORT || 8181 }, (err, address) => {
	if (err) {
		app.log.error(err)
		process.exit(1)
	}

	console.log(`[API] Service listening on ${address}`)
})
