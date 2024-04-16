import express from "express";

import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  createShop,
  getAllShop,
  signinShop,
} from "../controllers/shopController.js";
const router = express.Router();

router.get("/", getAllShop);
router.post("/", createShop);
router.post("/signin", signinShop);

export default router;
