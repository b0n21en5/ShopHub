import express from "express";
import { addNewCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/add-new", addNewCategory);

export default router;
