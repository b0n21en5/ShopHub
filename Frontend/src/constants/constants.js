export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://shophub-hy4k.onrender.com/api"
    : "http://localhost:8000/api";

// auth routes
export const loginRoute = `${BASE_URL}/auth/login`;
export const registerRoute = `${BASE_URL}/auth/register`;
export const updateUserRoute = `${BASE_URL}/auth/update-user`;
export const adminLoginRoute = `${BASE_URL}/auth/admin-login`;
export const allOrdersRoute = `${BASE_URL}/auth/get-all-orders`;
export const userOrdersRoute = `${BASE_URL}/auth/single-user-orders`; // query: time, status, search
export const updateOrderRoute = `${BASE_URL}/auth/update-order`; // param: orderId

// category routes
export const addCategoryRoute = `${BASE_URL}/category/add-new`;
export const allCatsRoute = `${BASE_URL}/category/get-all`;
export const catDetailRoute = `${BASE_URL}/category/get-single`; // param: cid
export const catPhotoRoute = `${BASE_URL}/category/photo`; // param: cid
export const updateCatRoute = `${BASE_URL}/category/update`; // param: cid
export const deleteCatRoute = `${BASE_URL}/category/delete`; // param: cid

// product routes
export const addProductRoute = `${BASE_URL}/products/add-new`;
export const allProductsRoute = `${BASE_URL}/products/all-products`;
export const productDetailRoute = `${BASE_URL}/products/get-single`; // param: pid
export const productPhotoRoute = `${BASE_URL}/products/photo`; // param: pid
export const cartProductsRoute = `${BASE_URL}/products/get-multiple`; // query: ids
export const productByCatRoute = `${BASE_URL}/products/get-by-category`; // param: cid
export const productBySubCatRoute = `${BASE_URL}/products/get-by-sub-category`; // param: subcat id
export const searchProductsRoute = `${BASE_URL}/products/search`; // param: searchKey
export const similarProductsRoute = `${BASE_URL}/products/similar-products`; // param: cid & pid
export const allBrandsRoute = `${BASE_URL}/products/get-all-brands`; // param: cid
export const newlyAddedProductsRoute = `${BASE_URL}/products/get-recently-added`; // query: currPage, pageLimit

// query param: cid,sortBy,order,currPage,pageLimit,price,rating,discount,brand
export const filterProductsRoute = `${BASE_URL}/products/filter-products`;

export const paymentRoute = `${BASE_URL}/products/payment`;
export const paymentSuccessRoute = `${BASE_URL}/products/payment/success`;
export const updateProductRoute = `${BASE_URL}/products/update`; // param: pid
export const deleteProductRoute = `${BASE_URL}/products/update`; // param: pid
