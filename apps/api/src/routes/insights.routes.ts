import { Router } from "express";
import {
  getSummary,
  getCategories,
  getSuggestions,
  askAI,
} from "../controllers/insights.controller";

const router = Router();

router.get("/summary", getSummary);
router.get("/categories", getCategories);
router.get("/suggestions", getSuggestions);
router.post("/ask", askAI);

export default router;
