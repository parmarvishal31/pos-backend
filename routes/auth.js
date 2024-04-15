import express from "express";
import { signup, signin, profile } from "../controllers/authController.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", isLoggedIn, profile);

export default router;
