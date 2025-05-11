import mongoose from 'mongoose';

const ClientGroupSchema = new mongoose.Schema({
    GroupName: {
        type: String,
        required: true
    },
    GroupCode: {
        type: String,
        required: true
    },
    Country: {
        label: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        dialCode: {
            type: String,
            required: true
        }
    },
    Remark: { type: String, default: '' },
}, {
    timestamps: true // optional: adds createdAt and updatedAt fields
});

const ClientGroup = mongoose.model('ClientGroup', ClientGroupSchema);
export default ClientGroup;
