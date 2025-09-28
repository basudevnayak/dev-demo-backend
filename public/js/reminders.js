import cron from "node-cron";
import nodemailer from "nodemailer";

// Dummy policies data (replace with DB query in real project)
const policies = [
    {
        id: "POL001",
        holderName: "John Doe",
        email: "john@example.com",
        dueDate: "2025-09-25",
    },
    {
        id: "POL002",
        holderName: "Jane Smith",
        email: "jane@example.com",
        dueDate: "2025-09-27",
    },
];

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "your_email@gmail.com",    // replace with your Gmail
        pass: "your_app_password",       // Gmail App password
    },
});

// Function to check due policies and send email
function checkDuePolicies() {
    const today = new Date();

    policies.forEach((policy) => {
        const dueDate = new Date(policy.dueDate);
        const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 5 && daysDiff >= 0) {
            const mailOptions = {
                from: "your_email@gmail.com",
                to: policy.email,
                subject: `Policy Reminder: ${policy.id}`,
                text: `Hello ${policy.holderName},

Your policy ${policy.id} is due on ${policy.dueDate}. Please renew it before the due date.

Regards,
Insurance Team`,
            };

            transporter.sendMail(mailOptions)
                .then(info => console.log(`Reminder sent to ${policy.holderName}: ${info.response}`))
                .catch(error => console.error(`Failed to send email: ${error}`));
        }
    });
}

// Schedule cron job → runs every day at 9:00 AM
cron.schedule("0 9 * * *", () => {
    console.log("Running daily policy reminder check...");
    checkDuePolicies();
});

console.log("Reminder service started. Waiting for cron jobs...");
