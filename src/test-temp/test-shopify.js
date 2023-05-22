require('yamlenv').config()
const Shopify = require('shopify-api-node')

const data = {
	newProduct: {
		title: "New Product",
		body_html: "<p>This is a new product description.</p>",
		vendor: "Your Vendor",
		product_type: "Your Product Type",
		variants: [
			{
				price: "10.00",
				sku: "PRODUCT-SKU"
			}
		]
	}
}

const dataAuth = {
	shopName: process.env.SHOPIFY_SHOP_NAME,
	apiKey: process.env.SHOPIFY_API_KEY,
	password: process.env.SHOPIFY_PASSWD
}
console.log('dataAuth', dataAuth);

const shopify = new Shopify(dataAuth)
console.log('shopify', shopify);

try {
	// shopify.product.create(data.newProduct)
	const product = data.newProduct     //await shopify.product.create(data.newProduct)
	console.log(data.newProduct);
} catch (err) {
	console.error(err)
}
