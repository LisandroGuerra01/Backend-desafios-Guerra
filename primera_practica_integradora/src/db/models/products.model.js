import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: Array,
        required: false
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        default: 'active'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export const productsModel = mongoose.model('Products', productsSchema);