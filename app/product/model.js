import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: {
        type: String, 
        minlength: [3, 'Product name length at least 3 char.'],
        maxlength: [255, 'Product name length maximum 255 char.'],
        required: [true, 'Product name is required.']
    },
    description: {
        type: String, 
        maxlength: [1000, 'Description product length masimum 1000 char.']
    }, 
    price: {
        type: Number, 
        default: 0
    },
    image_url: String,
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category'
    },
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Tag'}
    ]
}, { timestamps: true })

export default mongoose.model('Product', productSchema);