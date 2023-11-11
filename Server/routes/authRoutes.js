import express from "express";
import {
  getAllOrdersWithFilters,
  registerController,
  updateUserCredentials,
  userLoginController,
} from "../controllers/authController.js";
import { verifyAuthentication } from "../helpers/verifyAuthentication.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", userLoginController);
router.put("/update-user",verifyAuthentication, updateUserCredentials);

// query params: time, status, search
router.get("/get-all-orders", verifyAuthentication, getAllOrdersWithFilters);

export default router;
