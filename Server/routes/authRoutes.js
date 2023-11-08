import express from "express";
import {
  registerController,
  updateUserCredentials,
  userLoginController,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", userLoginController);
router.put("/update-user",updateUserCredentials)

export default router;
