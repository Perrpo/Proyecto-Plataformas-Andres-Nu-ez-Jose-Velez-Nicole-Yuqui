class ProductsController {
    async listProducts(req, res) {
        // Logic to list products nearing expiration
        try {
            // Fetch products from the database
            const products = await Product.find({ expirationDate: { $lt: new Date() } });
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching products', error });
        }
    }

    async donateProduct(req, res) {
        // Logic to handle product donation
        const { productId } = req.body;
        try {
            // Update product status to donated in the database
            await Product.findByIdAndUpdate(productId, { donated: true });
            res.status(200).json({ message: 'Product donated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error donating product', error });
        }
    }

    async applyDiscount(req, res) {
        // Logic to apply discount to a product
        const { productId, discount } = req.body;
        try {
            // Update product price with discount in the database
            await Product.findByIdAndUpdate(productId, { price: discount });
            res.status(200).json({ message: 'Discount applied successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error applying discount', error });
        }
    }
}

export default new ProductsController();