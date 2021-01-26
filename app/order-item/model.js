import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema({
    name: {
        type: String, 
        minlength: [3, 'Product name length at least 3 char.'],
        maxlength: [255, 'Product name length maximum 255 char.'],
        required: [true, 'Product name is required.']
    },

    qty: {
        type: Number, 
        required: [true, 'Qty is required.'], 
        min: [1, 'Minimal qty is 1.'],
    }, 

    price: {
        type: Number, 
        default: 0
    },

    total_price: {
        type: Number, 
        default: 0
    },

    product: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product'
    }, 

    order: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order'
    }
}, { 
    toJSON: {
        virtuals: true
    }
});

export default mongoose.model('OrderItem', orderItemSchema);