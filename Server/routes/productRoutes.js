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

// query param: ids [array of id]
router.get("/get-multiple", getMultipleProducts);
router.get("/photo/:productId", getProductPhoto);
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
