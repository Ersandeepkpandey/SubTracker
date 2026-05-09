import "dotenv/config";
import { app } from "./index";
import { initCronJobs } from "./jobs";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`SubTrack API running on port ${PORT}`);
  initCronJobs();
});
