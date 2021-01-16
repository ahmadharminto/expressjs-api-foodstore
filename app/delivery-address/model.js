import mongoose from 'mongoose';

const deliveryAddressSchema = mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Name is required.'],
        maxLength: [255, 'Name length maximum 255 char.']
    },

    village: {
        type: String, 
        required: [true, 'Village is required.'],
        maxlength: [255, 'Village length maximum 255 char.']
    },

    district: {
        type: String, 
        required: [true, 'District is required.'],
        maxlength: [255, 'District length maximum 255 char.']
    }, 

    regency: {
        type: String, 
        required: [true, 'Regency is required.'],
        maxlength: [255, 'Regency length maximum 255 char.']
    }, 

    province: {
        type: String, 
        required: [true, 'Province is required.'],
        maxlength: [255, 'Province length maximum 255 char.']
    }, 

    detail: {
        type: String, 
        required: [true, 'Detail is required.'],
        maxlength: [1000, 'Detail length maximum 1000 char.']
    }, 

    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
}, { timestamps: true })

export default mongoose.model('DeliveryAddress', deliveryAddressSchema);