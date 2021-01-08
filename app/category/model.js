import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    name: {
        type: String, 
        minlength: [3, 'Category name length at least 3 char.'],
        maxlength: [20, 'Category name length maximum 20 char.'],
        required: [true, 'Category name is required.']
    }
}, { timestamps: true })

export default mongoose.model('Category', categorySchema);