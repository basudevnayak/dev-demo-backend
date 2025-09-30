import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
  policyNumber: { type: String, required: true, unique: true },
  holderName: { type: String, required: true },
  agentName: { type: String, required: true },
  policyCompany: { type: String, required: true },
  createDate: { type: Date, required: true },
  policyPremium: { type: Number, required: true },
  installmentFreq: { type: String, required: true },
  planTerm: { type: Number, required: true },
  endDate: { type: Date, required: true },
  totalValue: { type: Number },
    userGmail: { type: String, default: '' },
}, { timestamps: true });


const Policies = mongoose.model('Policies', policySchema);

export default Policies;
