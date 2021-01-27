import mongoose from 'mongoose';

const invoiceSchema = mongoose.Schema({
    sub_total: {
        type: Number, 
        required: [true, 'Subtotal is required.'], 
    },

    delivery_fee: {
        type: Number, 
        required: [true, 'Delivery fee is required.']
    }, 

    delivery_address: {
        province: { type: String, required: [true, 'Province is required.']},
        regency: { type: String, required: [true, 'Regency is required.']},
        district: { type: String, required: [true, 'District is required.']},
        village: { type: String, required: [true, 'Village is required.']},
        detail: {type: String}
    }, 

    total: {
        type: Number, 
        required: [true, 'Total is required.']
    },

    payment_status: {
        type: String, 
        enum: ['waiting_payment', 'paid'], 
        default: 'waiting_payment'
    },

    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },

    order: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order'
    }
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);