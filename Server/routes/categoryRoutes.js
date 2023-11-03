import express from "express";
import {
  addNewCategory,
  deleteCategory,
  getAllCategory,
  getCategoryPhoto,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/add-new", addNewCategory);
router.get("/get-all", getAllCategory);
router.get("/photo/:cid", getCategoryPhoto);

router.put("/update/:cid", updateCategory);

router.delete("/delete/:cid", deleteCategory);

export default router;
