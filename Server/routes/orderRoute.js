import express from "express";
import { getOrdersByUser, makeNewOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/make-new", makeNewOrder);
router.get("/get-all/:userId", getOrdersByUser);

export default router;
