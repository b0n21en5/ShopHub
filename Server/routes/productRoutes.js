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
  searchProducts,
  filterProducts,
  getAllBrands,
} from "../controllers/productController.js";
import formidableMiddleware from "express-formidable";
import { verifyAuthentication } from "../helpers/verifyAuthentication.js";

const router = express.Router();

router.post(
  "/add-new",
  verifyAuthentication,
  formidableMiddleware(),
  addNewProduct
);

router.get("/get-all", getAllProducts);

router.get("/get-product/:productId", getSingleProduct);
router.get("/photo/:productId", getProductPhoto);
router.get("/get-by-category/:cid", getProductsByCategory);
router.get("/get-by-sub-category/:subcat", getProductsBySubCategory);
router.get("/search/:searchKey", searchProducts);

// query param: cid,sortBy,order,currPage,pageLimit,price,rating,discount,brand
router.get("/filter-products", filterProducts);

// query param: catId (category Id)
router.get("/get-all-brands", getAllBrands);

router.put(
  "/update-product/:productId",
  formidableMiddleware(),
  verifyAuthentication,
  updateProduct
);

router.delete(
  "/delete-product/:productId",
  verifyAuthentication,
  deleteProduct
);

export default router;
