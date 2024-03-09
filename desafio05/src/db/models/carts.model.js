import mongoose from 'mongoose';

const cartsSchema = new mongoose.Schema({
    products: [{
        pid: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number },
        _id: false
    }],

    timestamp: { type: Date, default: Date.now }
});

cartsSchema.pre('find', function(next) {
    this.populate('products.pid');
    next();
});

export const cartsModel = mongoose.model('carts', cartsSchema);