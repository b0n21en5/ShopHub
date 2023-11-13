import express from "express";
import {
  addNewCategory,
  deleteCategory,
  getAllCategory,
  getCategoryPhoto,
  updateCategory,
} from "../controllers/categoryController.js";
import formidableMiddleware from "express-formidable";
import { verifyAuthentication } from "../helpers/verifyAuthentication.js";

const router = express.Router();

router.post(
  "/add-new",
  verifyAuthentication,
  formidableMiddleware(),
  addNewCategory
);
router.get("/get-all", getAllCategory);
router.get("/photo/:cid", getCategoryPhoto);

router.put(
  "/update/:cid",
  verifyAuthentication,
  formidableMiddleware(),
  updateCategory
);

router.delete("/delete/:cid", verifyAuthentication, deleteCategory);

export default router;
