import cron from "node-cron";
import Policies from "../models/policies/Policies.js";
import { sendEmail } from "../utils/sendEmail.js"; // custom email utility

cron.schedule("* * * * *", async () => {
  console.log("📢 Reminder Cron Running:", new Date().toLocaleString());
  try {
    const policies = await Policies.find({ status: "active" });
    for (const policy of policies) {
      const due = new Date(policy.endDate);
      const today = new Date();
      const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      if ([10, 5, 0].includes(diffDays)) {
        await sendEmail({
          to: policy.userGmail,  // assume you store email
          subject: `Policy Payment Reminder: ${policy.policyNumber}`,
          text: `Dear ${policy.holderName}, your policy ${policy.policyNumber} is due on ${due.toDateString()}. Please make payment of Rs.${policy.premiumAmount}.`
        });
        console.log(`📧 Reminder sent to ${policy.holderName} (${policy.policyNumber})`);
      }
    }
  } catch (error) {
    console.error("❌ Reminder Cron Error:", error.message);
  }
});
