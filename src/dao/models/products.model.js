import mongoose from "mongoose";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
    status: {
        type: Boolean,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String
    },

    status: {type: Boolean, default: true}

});

const productModel = mongoose.model(productsCollection, productSchema);
export default productModel 
