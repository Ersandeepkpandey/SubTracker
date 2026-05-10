import { Router } from "express";
import { listUsers, getOverview, getAllSubscriptions, getAllNotifications, getLogs, getAnalytics } from "../controllers/admin.controller";

const router = Router();

router.get("/overview", getOverview);
router.get("/users", listUsers);
router.get("/subscriptions", getAllSubscriptions);
router.get("/notifications", getAllNotifications);
router.get("/logs", getLogs);
router.get("/analytics", getAnalytics);

export default router;
