import { Router } from "express";
import { listUsers, getAnalytics, getLogs } from "../controllers/admin.controller";

const router = Router();

router.get("/users", listUsers);
router.get("/analytics", getAnalytics);
router.get("/logs", getLogs);

export default router;
