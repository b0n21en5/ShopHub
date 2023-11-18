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
  getMultipleProducts,
  makeOrderPayment,
  handleSuccessfulPayment,
  getSimilarProducts,
  getNewlyAddedProduct,
} from "../controllers/productController.js";
import formidableMiddleware from "express-formidable";
import { verifyAuthentication, verifyAuthorization } from "../helpers/verifyAuthentication.js";

const router = express.Router();

router.post(
  "/add-new",
  verifyAuthorization,
  formidableMiddleware(),
  addNewProduct
);

router.get("/get-all", getAllProducts);

router.get("/get-single/:productId", getSingleProduct);

// query param: ids [array of id]
router.get("/get-multiple", getMultipleProducts);
router.get("/photo/:productId", getProductPhoto);

// optional query params: currPage, pageLimit
router.get("/get-by-category/:cid", getProductsByCategory);
router.get("/get-by-sub-category/:subcat", getProductsBySubCategory);
router.get("/search/:searchKey", searchProducts);
router.get("/similar-products/:catid/:pid", getSimilarProducts);

// query param: cid,sortBy,order,currPage,pageLimit,price,rating,discount,brand
router.get("/filter-products", filterProducts);

// query param: catId (category Id)
router.get("/get-all-brands", getAllBrands);

// query param: currPage,pageLimit
router.get("/get-recently-added", getNewlyAddedProduct);

// Razorpay payment route
router.post("/payment", verifyAuthentication, makeOrderPayment);
router.post("/payment/success", verifyAuthentication, handleSuccessfulPayment);

// Update Product
router.put(
  "/update/:productId",
  formidableMiddleware(),
  verifyAuthorization,
  updateProduct
);

// Delete Product
router.delete(
  "/delete/:productId",
  verifyAuthorization,
  deleteProduct
);

export default router;
