import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, default: '', required: true },
    remark: { type: String, default: '' },
}, { timestamps: true });


const BusinessNatureTypes = mongoose.model('BusinessNatureTypes', userSchema);

export default BusinessNatureTypes;
