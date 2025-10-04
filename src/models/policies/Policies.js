import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
  policyNumber: { type: String, required: true },
  holderName: String,
  agentName: String,
  policyCompany: String,
  createDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  installmentFreq: { type: String, enum: ["Monthly", "Quarterly", "Yearly"], default: "Monthly" },
  policyPremium: { type: Number, required: true },
  planTerm: { type: Number, required: true },
  paymentsMade: { type: Number, default: 0 }, // auto increment on payment
  userGmail: { type: String, default: '' },
  status: { type: String, enum: ["active", "expired", "paid"], default: "active" }
}, { timestamps: true });

// Virtual field: Next Due Date (based on payments made + installmentFreq)
policySchema.virtual("nextDueDate").get(function () {
  if (!this.createDate) return null;
  let date = new Date(this.createDate);
  let monthsToAdd = 0;

  if (this.installmentFreq === "Monthly") monthsToAdd = this.paymentsMade;
  if (this.installmentFreq === "Quarterly") monthsToAdd = this.paymentsMade * 3;
  if (this.installmentFreq === "Yearly") monthsToAdd = this.paymentsMade * 12;

  date.setMonth(date.getMonth() + monthsToAdd + (this.installmentFreq === "Monthly" ? 1 : this.installmentFreq === "Quarterly" ? 3 : 12));
  return date;
});

// Virtual field: Total Invested
policySchema.virtual("investedSoFar").get(function () {
  return this.premiumAmount * this.paymentsMade;
});

export default mongoose.model("Policies", policySchema);
