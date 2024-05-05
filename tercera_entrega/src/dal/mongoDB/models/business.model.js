import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 50,
    },
    address: {
        type: String,
        min: 3,
        max: 50,
    },
    phone: {
        type: Number,
        min: 3,
        max: 50000000000000,
    },
    email: {
        type: String,
        unique: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    deleteAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const businessModel = mongoose.model('Business', businessSchema);

export default businessModel;