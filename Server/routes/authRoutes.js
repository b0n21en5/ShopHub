import express from "express";
import {
  adminLoginController,
  getAllOrders,
  getSingleUserOrdersWithFilters,
  registerController,
  updateUserCredentials,
  userLoginController,
} from "../controllers/authController.js";
import { verifyAuthentication } from "../helpers/verifyAuthentication.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", userLoginController);
router.post("/admin-login", adminLoginController);
router.put("/update-user", verifyAuthentication, updateUserCredentials);

router.get("/get-all-orders", getAllOrders);
// query params: time, status, search
router.get(
  "/single-user-orders",
  verifyAuthentication,
  getSingleUserOrdersWithFilters
);

export default router;
