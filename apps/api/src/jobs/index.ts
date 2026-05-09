import cron from "node-cron";
import { runRenewalRemindersJob } from "./renewal-reminders.job";
import { runTrialEmailsJob } from "./trial-emails.job";

export function initCronJobs() {
  // Renewal reminders — every day at 9:00 AM IST (3:30 AM UTC)
  cron.schedule("30 3 * * *", async () => {
    try {
      await runRenewalRemindersJob();
    } catch (err) {
      console.error("[cron] Renewal reminders job failed:", err);
    }
  });

  // Trial conversion emails — every day at 10:00 AM IST (4:30 AM UTC)
  cron.schedule("30 4 * * *", async () => {
    try {
      await runTrialEmailsJob();
    } catch (err) {
      console.error("[cron] Trial emails job failed:", err);
    }
  });

  console.log("[cron] Jobs initialized");
}
