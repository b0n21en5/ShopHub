import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import Home from "./pages/Home/Home";

// Lazy-loaded components
const ProductDetail = lazy(() => import("./pages/ProductDetail/ProductDetail"));
const CartPage = lazy(() => import("./pages/CartPage/CartPage"));
const ProductCatalog = lazy(() =>
  import("./pages/ProductCatalog/ProductCatalog")
);
const Order = lazy(() => import("./pages/Order/Order"));
const MyProfile = lazy(() => import("./pages/MyProfile/MyProfile"));
const Auth = lazy(() => import("./pages/Auth/Auth"));
const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard/AdminDashboard")
);
const ManageItem = lazy(() => import("./pages/ManageItem/ManageItem"));
const Error = lazy(() => import("./pages/Error/Error"));

function App() {
  const [categories, setCategories] = useState([]);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/get-all");
      setCategories(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <BrowserRouter>
      <NavBar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />

          {categories.map((category) => (
            <Route path={`/${category.slug}`} key={category._id}>
              <Route path="" element={<ProductCatalog />} />
              <Route path=":pid" element={<ProductDetail />} />
            </Route>
          ))}

          <Route path="/cart" element={<CartPage />} />
          <Route path="/account/profile" element={<MyProfile />} />
          <Route path="/account/orders" element={<Order />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/sign-up" element={<Auth />} />
          <Route path="/admin">
            <Route path="" element={<AdminDashboard />} />
            <Route path="add-new">
              <Route path=":slug" element={<ManageItem />} />
            </Route>
            <Route path=":links">
              <Route path="" element={<AdminDashboard />} />
              <Route path=":id" element={<ManageItem />} />
            </Route>
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;
