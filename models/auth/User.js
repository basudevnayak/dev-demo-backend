import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, unique: true, sparse: true },  // optional but unique
  password: { type: String, default: '' },
  phoneNumber: { type: String, required: true},
  photo: { type: String, default: '' },
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

export default User;
