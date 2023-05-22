require('yamlenv').config()
/////const Shopify = require('../../../libs/shopify')
const Shopify = require('shopify-api-node')

const dataAuth = {
	shopName: process.env.SHOPIFY_SHOP_NAME,
	apiKey: process.env.SHOPIFY_API_KEY,
	password: process.env.SHOPIFY_API_SECRET_KEY
}

const shopify = new Shopify(dataAuth)

//#region createProduct
module.exports.createProduct = async function (request, reply) {
	const { data } = request.body
	if (!data || !data.newProduct) {
		throw new Error('Invalid data')
	}
	try {
		const products = await shopify.product.list();
		console.log('products', products);
		const product = await shopify.product.create(data.newProduct)
		console.log('product', product);
		return { message: `Product '${product.toString()}' created successfully.` }
	} catch (err) {
		console.error(err)
		throw new Error('Server error.')
	}
}
//#endregion createProduct