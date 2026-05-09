import { Router } from "express";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createCheckoutSession,
  handleWebhook,
  getPortalSession,
} from "../controllers/stripe.controller";

const router = Router();

router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);
router.post("/checkout", authMiddleware, createCheckoutSession);
router.post("/portal", authMiddleware, getPortalSession);

export default router;
