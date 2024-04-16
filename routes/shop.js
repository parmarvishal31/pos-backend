import express from "express";

import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  createShop,
  deleteShop,
  getAllShop,
  signinShop,
  updateShop,
} from "../controllers/shopController.js";
const router = express.Router();

router.get("/", getAllShop);
router.post("/", createShop);
router.post("/signin", signinShop);
router.put("/:id", updateShop);
router.delete("/:id", deleteShop);
export default router;
