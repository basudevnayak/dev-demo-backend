import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    DepartmentName: { type: String, default: '', required: true },
    Remarks: { type: String, default: '' },
}, { timestamps: true });


const Departments = mongoose.model('Departments', userSchema);

export default Departments;
