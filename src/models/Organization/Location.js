import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const LocationSchema = new Schema({
  Location: {
    type: String,
    required: true
  },
  Company: {
    label: { type: String, required: true },
    value: { type: Schema.Types.ObjectId, required: true, ref: 'Company' }
  },
  Country: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    dialCode: { type: String, required: true }
  },
  State: {
    label: { type: String, required: true },
    value: { type: Schema.Types.ObjectId, required: true, ref: 'State' }
  },
  LocationCode: { type: String, required: true },
  Remark: { type: String },
  StateCode: { type: String, required: true },
  serial_id: { type: Number, unique: true }
}, { timestamps: true });

const Location = model('location', LocationSchema);

export default Location;
