import express from "express";

import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { createShop, getAllShop } from "../controllers/shopController.js";
const router = express.Router();

router.get("/", getAllShop);
router.post("/", createShop);


export default router;
