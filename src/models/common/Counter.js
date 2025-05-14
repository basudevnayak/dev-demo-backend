// models/Counter.js
import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },   // e.g., 'subLocation'
  seq: { type: Number, default: 11100 }    // Start before 11101
});

export default mongoose.model('Counter', counterSchema);
