const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS));

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

admin.firestore().settings({ ignoreUndefinedProperties: true })

module.exports = admin

