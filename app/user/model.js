import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);
const HASH_ROUND = 10;

const userSchema = mongoose.Schema({
    full_name: {
        type: String, 
        required: [true, 'Fullname is required.'], 
        maxlength: [255, 'Fullname length maximum 255 char.'],
        minlength: [3, 'Fullname length at least 3 char.']
    }, 
    customer_id: {
        type: Number, 
    },
    email: {
        type: String, 
        required: [true, 'Email is required'], 
        maxlength: [255, 'Email length maximum 255 char.'],
    },
    password: {
        type: String, 
        required: [true, 'Password is required.'], 
        maxlength: [255, 'Password length maximum 255 char.'], 
    }, 
    role: {
        type: String, 
        enum: ['user', 'admin'],
        default: 'user'
    },
    token: [String]
}, { timestamps: true });

userSchema.path('email').validate(function(value){
    const emailRE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRE.test(value);
}, attr => `${attr.value} must be valid email.`);

userSchema.path('email').validate(async function(value){
    try{
        const count = await this.model('User').count({email: value});
        return !count;
    } catch (err) {
        throw err
    }
}, attr => `${attr.value} already exists.`);

userSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
});

userSchema.plugin(AutoIncrement, {inc_field: 'customer_id'});

export default mongoose.model('User', userSchema);