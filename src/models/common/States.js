import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, default: '', required: true },
    code: { type: String, default: '' },
    id:{ type: String, default: '' },
    country_id: { type: String, default: '' },
}, { timestamps: true });


const States = mongoose.model('States', userSchema);

export default States;
