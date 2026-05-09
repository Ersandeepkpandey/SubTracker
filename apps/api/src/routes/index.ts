import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { trialMiddleware } from "../middleware/trial.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import subscriptionRoutes from "./subscriptions.routes";
import gmailRoutes from "./gmail.routes";
import notificationRoutes from "./notifications.routes";
import insightRoutes from "./insights.routes";
import stripeRoutes from "./stripe.routes";
import adminRoutes from "./admin.routes";
import userRoutes from "./user.routes";

export const router = Router();

const protected_ = [authMiddleware, trialMiddleware];

router.use("/subscriptions", ...protected_, subscriptionRoutes);
router.use("/gmail", authMiddleware, gmailRoutes);
router.use("/notifications", ...protected_, notificationRoutes);
router.use("/insights", ...protected_, insightRoutes);
router.use("/stripe", stripeRoutes);
router.use("/admin", adminMiddleware, adminRoutes);
router.use("/user", authMiddleware, userRoutes);
