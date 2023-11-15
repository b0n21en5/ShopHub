import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigation } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState({});
  const [auth, setAuth] = useState({
    login: "",
    password: "",
    showPass: false,
  });

  const [pageData, setPageData] = useState([]);

  const path = useLocation().pathname.substring(7);

  useEffect(() => {
    if (localStorage.getItem("admin-shophub")) {
      setAdmin(JSON.parse(localStorage.getItem("admin-shophub")));
    }

    if (path !== "") updatePageData();
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/admin-login", {
        email: auth.login,
        phone: parseInt(auth.login),
        password: auth.password,
      });
      localStorage.setItem("admin-shophub", JSON.stringify(data));
      setAdmin(data);
      toast.success(`${data.username} logged in`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    setPageData([]);
    if (path !== "") updatePageData();
  }, [path]);

  const updatePageData = async () => {
    try {
      let result;

      if (path === "products") {
        result = await axios.get(`/api/products/get-all`);
      } else if (path === "categories") {
        result = await axios.get(`/api/category/get-all`);
      } else {
        result = await axios.get(`/api/auth/get-all-orders`);
      }

      setPageData(result.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      {!admin.username ? (
        <div className={styles.login_cnt}>
          <form onSubmit={handleAdminLogin} className={styles.admin_login}>
            <h2>Admin Login</h2>
            <input
              type="text"
              value={auth.login}
              placeholder="Enter Your Email/Mobile Number"
              onChange={(e) =>
                setAuth((p) => ({ ...p, login: e.target.value }))
              }
              autoFocus
            />
            <div className={styles.password}>
              <input
                type={auth.showPass ? "text" : "password"}
                value={auth.password}
                placeholder="Enter Password"
                onChange={(e) =>
                  setAuth((p) => ({ ...p, password: e.target.value }))
                }
              />
              <FontAwesomeIcon
                icon={faEye}
                onClick={() =>
                  setAuth((p) => ({ ...p, showPass: !p.showPass }))
                }
                style={{ cursor: "pointer" }}
              />
            </div>
            <button type="submit" className={styles.login_btn}>
              Login
            </button>
          </form>
        </div>
      ) : (
        <div className={styles.admin_dashboard}>
          <div className={styles.nav}>
            <Link to="/admin">Admin Dashboard</Link>
            <div className={styles.nav_menu}>
              <Link to="/admin/products">Products</Link>
              <Link to="/admin/categories">Categories</Link>
              <Link to="/admin/orders">Orders</Link>
            </div>
          </div>

          {path === "" ? (
            <div className={styles.admin_body}>
              <div>Admin Name: {admin.username}</div>
              <div>Admin Email: {admin.email}</div>
              <div>Admin Contact: {admin.phone}</div>
            </div>
          ) : (
            pageData && (
              <div className={styles.data_section}>
                {pageData?.map((prodt) => (
                  <Link
                    to={`/admin/product/${prodt._id}`}
                    key={prodt._id}
                  >
                    <img
                      src={`/api/${
                        path === "categories" ? "category" : "products"
                      }/photo/${prodt._id}`}
                      alt={prodt?.name}
                      width={150}
                      height={180}
                    />
                    <div>
                      {prodt?.name?.length > 17
                        ? prodt?.name?.substr(0, 17) + "..."
                        : prodt?.name}
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
