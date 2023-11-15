import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import NavBar from "./Components/NavBar/NavBar";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import CartPage from "./pages/CartPage/CartPage";
import ProductCatalog from "./pages/ProductCatalog/ProductCatalog";
import Order from "./pages/Order/Order";
import MyProfile from "./pages/MyProfile/MyProfile";
import Auth from "./pages/Auth/Auth";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import ManageItem from "./pages/ManageItem/ManageItem";

function App() {
  const [categores, setCategores] = useState([]);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/get-all");
      setCategores(data);
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
      <Routes>
        <Route path="/" element={<Home />} />

        {categores.map((category) => (
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
          <Route path=":links">
            <Route path="" element={<AdminDashboard />} />
            <Route path=":id" element={<ManageItem />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="bottom-left" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;
