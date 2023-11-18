import express from "express";
import {
  addNewCategory,
  deleteCategory,
  getAllCategory,
  getCategoryPhoto,
  getSingleCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import formidableMiddleware from "express-formidable";
import {
  verifyAuthentication,
  verifyAuthorization,
} from "../helpers/verifyAuthentication.js";

const router = express.Router();

router.post(
  "/add-new",
  verifyAuthorization,
  formidableMiddleware(),
  addNewCategory
);

router.get("/get-single/:cid", getSingleCategory);
router.get("/get-all", getAllCategory);
router.get("/photo/:cid", getCategoryPhoto);

// Update Category
router.put(
  "/update/:cid",
  verifyAuthorization,
  formidableMiddleware(),
  updateCategory
);

// Delete Category
router.delete("/delete/:cid", verifyAuthorization, deleteCategory);

export default router;
