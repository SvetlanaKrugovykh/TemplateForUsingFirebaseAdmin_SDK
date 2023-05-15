const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.applicationDefault()
})

// Configure firestore
admin.firestore().settings({ ignoreUndefinedProperties: true })

module.exports = admin
