import { Router } from "express";
import {
  connectGmail,
  syncGmail,
  getGmailStatus,
  disconnectGmail,
} from "../controllers/gmail.controller";

const router = Router();

router.post("/connect", connectGmail);
router.post("/sync", syncGmail);
router.get("/status", getGmailStatus);
router.delete("/disconnect", disconnectGmail);

export default router;
