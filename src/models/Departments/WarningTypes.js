import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, default: '', required: true },
    remark: { type: String, default: '' },
}, { timestamps: true });


const WarningTypes = mongoose.model('WarningTypes', userSchema);

export default WarningTypes;
