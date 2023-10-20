import express from "express";
import {
  addNewProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  getProductPhoto,
  getSingleProduct,
  updateProduct,
  getProductsBySubCategory,
} from "../controllers/productController.js";
import formidableMiddleware from "express-formidable";
import { verifyAuthentication } from "../helpers/verifyAuthentication.js";

const router = express.Router();

router.post("/add-new",verifyAuthentication, formidableMiddleware(), addNewProduct);

router.get("/get-all", getAllProducts);

router.get("/get-product/:productId", getSingleProduct);
router.get("/photo/:productId", getProductPhoto);
router.get("/get-by-category/:cid", getProductsByCategory);
router.get("/get-by-sub-category/:subcat", getProductsBySubCategory);

router.put("/update-product/:productId",verifyAuthentication, updateProduct);

router.delete("/delete-product/:productId",verifyAuthentication, deleteProduct);

export default router;
