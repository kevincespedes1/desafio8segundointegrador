import productModel from "../models/products.model.js";

class ProductManager {

    async getProducts() {
        const products = await productModel.find();
        return products;
    };

    async addProduct(newProduct) {
        try {
            const product = new productModel({
                title: newProduct.title,
                category: newProduct.category,
                description: newProduct.description,
                price: newProduct.price,
                thumbnail: newProduct.thumbnail,
                code: newProduct.code,
                stock: newProduct.stock,
                status: newProduct.status
            });
            const savedProduct = await product.save();
            console.log('Producto añadido correctamente')
            return savedProduct;
        } catch (error) {
            throw new Error(`Error adding product: ${error.message}`);
        }
    }

    async getProductById(id) {
        const product = await productModel.findById(id);
        if (product) {
            return product;
        }
        else {
            return;
        };
    };

    async updateProduct(id, newProduct) {
        const updateProduct = await productModel.findByIdAndUpdate(id, newProduct)
        if (!updateProduct) {
            return;
        } else {
            return updateProduct;
        };
    };

    async deleteProduct(id) {
        const deleteProduct = await productModel.findByIdAndDelete(id);
        if (!deleteProduct) {
            return; 
        }
        else {
            return deleteProduct;
        };
    };


};

const productManager = new ProductManager();
export default productManager;