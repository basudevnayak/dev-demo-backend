import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const SubLocationSchema = new mongoose.Schema({
  SubLocation: { type: String, required: true },
  Company: {
    label: { type: String, required: true },
    value: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  NatureOfBusiness: {
    label: { type: String, required: true },
    value: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  AddressLine1: { type: String, required: true },
  City: { type: String, required: true },
  ZIPPincode: { type: String, required: true },
  PAN: { type: String, required: true },
  GSTIN: { type: String, required: true },
  TAN: { type: String, required: true },
  AgreementValidFrom: { type: Date, required: true },
  AgreementValidTill: { type: Date, required: true },
  BankAccountNo: { type: String, required: true },
  IFSC: { type: String, required: true },
  PaymentMethod: {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  MinAge: { type: String, required: true },
  SpecialRemarkForPayment: { type: String, required: true },
  PayrollCycleFrom: { type: Date, required: true },
  PayrollCycleTo: { type: Date, required: true },
  InvocingTimeline: { type: String, required: true },
  PaymentReceivableTimeline: { type: String, required: true },
  PaymentPayableTimeline: { type: String, required: true },
  ScopeofRevenue: { type: String, required: true },
  ServiceCharges: {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  ContactPerson1: { type: String, required: true },
  Designation: { type: String, required: true },
  ContactNo: { type: String, required: true },
  ContactEmail: { type: String, required: true },
  Country: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    dialCode: { type: String, required: true },
  },
  State: {
    label: { type: String, required: true },
    value: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  SubLocationCode: { type: String, required: true },
  Remark: { type: String, required: true },
  AgreementUpload: { type: String, required: true, },
  Logo: { type: String },
  serial_id: { type: Number, unique: true }

}, {
  timestamps: true,
});

const SubLocation = model('SubLocation', SubLocationSchema);

export default SubLocation;
