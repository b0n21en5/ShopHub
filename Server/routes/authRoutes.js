import express from "express";
import {
  registerController,
  userLoginController,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", userLoginController);

export default router;
