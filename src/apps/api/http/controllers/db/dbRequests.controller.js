const Firebase = require('../../../../../../libs/firebase')
const HttpError = require('http-errors')

//#region listCollections
module.exports.listCollections = async function (request, reply) {
	try {
		const collections = await Firebase.admin.firestore().listCollections();
		const collectionNames = collections.map((c) => c.id);
		return { collections: collectionNames };
	} catch (err) {
		if (err.code === 404 || err.message === 'Not active') {
			throw new Error('Not Found or Not active');
		}
		console.error(err);
		throw new Error('Server error.');
	}
};
//#endregion listCollections

//#region createCollection
module.exports.createCollection = async function (request, reply) {
	try {
		const collectionId = request.body.collectionId;
		const firestore = Firebase.admin.firestore();

		// Check if the collection already exists
		const collectionRef = firestore.collection(collectionId);
		const collectionSnapshot = await collectionRef.get();

		if (!collectionSnapshot.empty) {
			return { message: `Collection '${collectionId}' already exists.` };
		}

		// Create the collection
		await collectionRef.add({});

		return { message: `Collection '${collectionId}' created successfully.` };
	} catch (err) {
		console.error(err);
		throw new Error('Server error.');
	}
};
//#endregion createCollection

//#region getCollectionWithName
module.exports.getCollectionWithName = async function (request, reply) {

	const collectionName = request.headers?.collectionname || 'ip_addresses'
	const firestore = Firebase.admin.firestore().collection(collectionName)
	try {
		const collections = await firestore.listDocuments()
		const collectionNames = collections.map((c) => c.id)
		return { collections: collectionNames }
	} catch (err) {
		if (err.message === 'Response code 404 (Not Found)' || err.message === 'Not active') {
			throw HttpError.NotFound('Not Found or Not active')
		}
		console.log(err)

		throw HttpError.InternalServerError('Server error.')
	}
}
//#endregion getCollectionWithName

//#region listDocumentsInCollection
module.exports.listDocumentsInCollection = async function (request, reply) {
	try {
		const collectionId = request.body.collectionId;
		const firestore = Firebase.admin.firestore();
		const collectionRef = firestore.collection(collectionId);
		const querySnapshot = await collectionRef.get()
		const documents = querySnapshot.docs.map((doc) => doc.data())
		return { documents }
	} catch (err) {
		if (err.message === 'Response code 404 (Not Found)' || err.message === 'Not active') {
			throw HttpError.NotFound('Not Found or Not active')
		}
		console.log(err)
		throw HttpError.InternalServerError('Server error.')
	}
}
//#endregion listDocumentsInCollection

//#region CreateDocumentInCollection
module.exports.createDocumentInCollection = async function (request, reply) {
	const collectionId = request.body.collectionId;
	const firestore = Firebase.admin.firestore();
	const document = request.body.document;

	try {
		const collectionRef = firestore.collection(collectionId);
		const documentRef = collectionRef.doc();
		const timestamp = Firebase.admin.firestore.FieldValue.serverTimestamp();
		const updatedDocument = { ...document, createdAt: timestamp, documentId: documentRef.id };

		const existingDocument = await documentRef.get();
		if (existingDocument.exists) {
			throw new Error('Document with the same ID already exists.');
		}
		await documentRef.set(updatedDocument);
		return { documentId: documentRef.id };
	} catch (err) {
		if (err.message === 'Response code 404 (Not Found)' || err.message === 'Not active') {
			throw HttpError.NotFound('Not Found or Not active');
		}
		console.log(err);
		throw HttpError.InternalServerError('Server error.');
	}
};
//#endregion CreateDocumentInCollection

//#region UpdateDocumentInCollection
module.exports.updateDocumentInCollection = async function (request, reply) {
	const collectionId = request.body.collectionId;
	const documentId = request.body.documentId;
	const firestore = Firebase.admin.firestore();
	const document = request.body.document;

	const timestamp = Firebase.admin.firestore.FieldValue.serverTimestamp();
	const updatedDocument = { ...document, updatedAt: timestamp };
	try {
		const collectionRef = firestore.collection(collectionId)
		await collectionRef.doc(documentId).update(updatedDocument)
		return { documentId }
	} catch (err) {
		if (err.message === 'Response code 404 (Not Found)' || err.message === 'Not active') {
			throw HttpError.NotFound('Not Found or Not active')
		}
		console.log(err)
		throw HttpError.InternalServerError('Server error.')
	}
}
//#endregion UpdateDocumentInCollection

//#region GetDocumentbyId
module.exports.getDocumentWithId = async function (request, reply) {
	const { projectId, collectionName, documentId } = request.body
	const firestore = Firebase.firestore({
		projectId
	})
	try {
		const collectionRef = firestore.collection(collectionName)
		const document = await collectionRef.doc(documentId).get()
		return { document: document.data() }
	} catch (err) {
		if (err.message === 'Response code 404 (Not Found)' || err.message === 'Not active') {
			throw HttpError.NotFound('Not Found or Not active')
		}
		console.log(err)
		throw HttpError.InternalServerError('Server error.')
	}
}
//#endregion GetDocumentbyId

//#region GetDocumentswthFilter
module.exports.getDocumentsWithFilter = async function (request, reply) {
	const { projectId, collectionName, filter } = request.body
	const firestore = Firebase.firestore({
		projectId
	})
	try {
		const collectionRef = firestore.collection(collectionName)
		const query = collectionRef.where(filter.field, filter.operator, filter.value)
		const querySnapshot = await query.get()
		const documents = querySnapshot.docs.map((doc) => doc.data())
		return { documents }
	} catch (err) {
		if (err.message === 'Response code 404 (Not Found)' || err.message === 'Not active') {
			throw HttpError.NotFound('Not Found or Not active')
		}
		console.log(err)
		throw HttpError.InternalServerError('Server error.')
	}
}
//#endregion GetDocumentswthFilter

//#region DeleteDocumentInCollection
module.exports.deleteDocumentInCollection = async function (request, reply) {
	const { projectId, collectionName, documentId } = request.body
	const firestore = Firebase.firestore({
		projectId
	})
	try {
		const collectionRef = firestore.collection(collectionName)
		await collectionRef.doc(documentId).delete()
		return { documentId }
	} catch (err) {
		if (err.message === 'Response code 404 (Not Found)' || err.message === 'Not active') {
			throw HttpError.NotFound('Not Found or Not active')
		}
		console.log(err)
		throw HttpError.InternalServerError('Server error.')
	}
}
//#endregion DeleteDocumentInCollection

//#region DeleteCollection
module.exports.deleteCollection = async function (request, reply) {
	const { projectId, collectionName } = request.body
	const firestore = Firebase.firestore({
		projectId
	})
	try {
		const collectionRef = firestore.collection(collectionName)
		const querySnapshot = await collectionRef.get()
		const documents = querySnapshot.docs.map((doc) => doc.data())
		const documentIds = querySnapshot.docs.map((doc) => doc.id)
		for (let i = 0; i < documents.length; i++) {
			await collectionRef.doc(documentIds[i]).delete()
		}
		return { collectionName }
	} catch (err) {
		console.log(err)
		throw HttpError.InternalServerError('Server error.')
	}
}
//#endregion DeleteCollection

