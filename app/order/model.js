import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence'
import Invoice from '../invoice/model.js';

const AutoIncrement = mongooseSequence(mongoose);

const orderSchema = mongoose.Schema({
    status: {
        type: String, 
        enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
        default: 'waiting_payment'
    },

    delivery_fee: {
        type: Number, 
        default: 0
    },

    delivery_address: {
        province: { type: String, required: [true, 'Province is required.']},
        regency: { type: String, required: [true, 'Regency is required.']},
        district: { type: String, required: [true, 'District is required.']},
        village: { type: String, required: [true, 'Village is required.']},
        detail: {type: String}
    }, 

    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },

    order_items: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'OrderItem'
        }
    ]
}, { 
    timestamps: true,
    toJSON: { virtuals: true }
});

orderSchema.plugin(AutoIncrement, { inc_field: 'order_number' });
orderSchema.virtual('items_count').get(function () {
    return this.order_items.reduce((total, item) => {
        return total + parseInt(item.qty);
    }, 0);
});
orderSchema.virtual('total_price').get(function () {
    return this.order_items.reduce((total, item) => {
        return total + item.total_price;
    }, 0);
});
orderSchema.post('save', async function() {
    let sub_total = this.order_items.reduce((sum, item) => sum += (item.price * item.qty), 0);
    let invoice = new Invoice({
        user: this.user, 
        order: this._id, 
        sub_total: sub_total, 
        delivery_fee: parseInt(this.delivery_fee),
        total: parseInt(sub_total + this.delivery_fee), 
        delivery_address: this.delivery_address
    });
    await invoice.save();
});

export default mongoose.model('Order', orderSchema);