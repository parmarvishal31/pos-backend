import express from "express";
import {
  createCategory,
  getCategory,
} from "../controllers/categoryController.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import checkSubscription from "../middlewares/checkSubscription.js";
const router = express.Router();

router.get("/", checkSubscription, getCategory);
router.post("/",checkSubscription, createCategory);

export default router;
