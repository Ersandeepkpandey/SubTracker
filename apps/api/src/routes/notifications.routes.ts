import { Router } from "express";
import {
  listNotifications,
  updatePreferences,
  getPreferences,
  getUpcoming,
  subscribePush,
  unsubscribePush,
} from "../controllers/notifications.controller";

const router = Router();

router.get("/", listNotifications);
router.get("/preferences", getPreferences);
router.patch("/preferences", updatePreferences);
router.get("/upcoming", getUpcoming);
router.post("/push/subscribe", subscribePush);
router.delete("/push/unsubscribe", unsubscribePush);

export default router;
