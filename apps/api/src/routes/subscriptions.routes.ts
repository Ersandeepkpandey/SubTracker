import { Router } from "express";
import {
  listSubscriptions,
  createSubscription,
  getSubscription,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscriptions.controller";

const router = Router();

router.get("/", listSubscriptions);
router.post("/", createSubscription);
router.get("/:id", getSubscription);
router.patch("/:id", updateSubscription);
router.delete("/:id", deleteSubscription);

export default router;
