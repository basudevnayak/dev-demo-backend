import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, default: '', required: true },
    code: { type: String, default: '' },
    id:{ type: String, default: '' },
}, { timestamps: true });


const Countries = mongoose.model('countries', userSchema);

export default Countries;
