
import mongoose from 'mongoose';
const CompanySchema = new mongoose.Schema({
  CompanyName: { type: String, required: true },
  CompanyCode: { type: String, required: true },
  ClientGroup: { type: Object, required: true },
  CompanyEntityType: { type: Object, required: true },
  TradingLegalName: { type: String, required: true },
  RegistrationNumberCIN: { type: String, required: true },
  DateOfIncorporation: { type: Date, required: true },
  AddressLine1: { type: String, required: true },
  AddressLine2: { type: String },
  Country: { type: Object, required: true },
  StateProvince: { type: Object, required: true },
  City: { type: String, required: true },
  ZIPPincode: { type: String, required: true },
  Phone: { type: String, required: true },
  Email: { type: String, required: true },
  Remark: { type: String },
  Website: { type: String },
  companyLogo: { type: String },
  serial_id: { type: Number, unique: true }
}, {
  timestamps: true,
});
const Company = mongoose.model('company', CompanySchema);
export default Company;
