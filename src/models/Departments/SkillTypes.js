import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, default: '', required: true },
    remark: { type: String, default: '' },
}, { timestamps: true });


const SkillTypes = mongoose.model('SkillTypes', userSchema);

export default SkillTypes;
