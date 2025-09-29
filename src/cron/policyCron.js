import cron from "node-cron";
import Policies from "../models/policies/Policies.js";

// Job logic: expire policies, log data
export const expirePolicies = async () => {
  console.log("⏰ Policy Cron Job running...", new Date().toLocaleString());

  try {
    const expiredPolicies = await Policies.find({
      expiryDate: { $lte: new Date().toLocaleString() },
      status: "active"
    });

    if (expiredPolicies.length === 0) {
      console.log("✅ No active policies to expire.");
    //   return;
    }

    const result = await Policies.updateMany(
      { _id: { $in: expiredPolicies.map(p => p._id) } },
      { $set: { status: "expired" } }
    );

    console.log(`✅ Policies expired: ${result.modifiedCount}`);

    // 3️⃣ Log each expired policy
    expiredPolicies.forEach(policy => {
      console.log("📋 Expired Policy:", {
        id: policy._id,
        policyNumber: policy.policyNumber,
        holderName: policy.holderName,
        agentName: policy.agentName,
        policyCompany: policy.policyCompany,
        expiryDate: policy.expiryDate,
        status: "expired"
      });
    });

  } catch (error) {
    console.error("❌ Error in policy cron job:", error.message);
  }
};

cron.schedule("* * * * *", expirePolicies);
