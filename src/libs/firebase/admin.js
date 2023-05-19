const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS));

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
	// ,
	// projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
	// serviceAccountId: process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_ID,
});

admin.firestore().settings({ ignoreUndefinedProperties: true })

module.exports = admin

