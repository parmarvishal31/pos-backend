import express from "express";
import {
  createCategory,
  getCategory,
} from "../controllers/categoryController.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", isLoggedIn, getCategory);
router.post("/", createCategory);

export default router;
