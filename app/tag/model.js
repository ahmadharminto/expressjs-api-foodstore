import mongoose from 'mongoose';

const tagSchema = mongoose.Schema({
    name: {
        type: String, 
        minlength: [3, 'Tag name length at least 3 char.'],
        maxlength: [50, 'Tag name length maximum 50 char.'],
        required: [true, 'Tag name is required.']
    }
}, { timestamps: true })

export default mongoose.model('Tag', tagSchema);