import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

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
    toJSON: {
        virtuals: true
    }
});

orderSchema.plugin(AutoIncrement, { inc_field: 'order_number'});
// orderSchema.virtual('items_count').get(() => {
//     return this.order_items.reduce((total, item) => {
//         return total + parseInt(item.qty);
//     }, 0);
// });

export default mongoose.model('Order', orderSchema);