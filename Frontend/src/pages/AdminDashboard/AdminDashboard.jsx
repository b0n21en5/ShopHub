import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faStar } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigation } from "react-router-dom";
import moment from "moment";
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

  const statusOptions = ["On the way", "Delivered", "Cancelled", "Returned"];

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
      } else if (path === "category") {
        result = await axios.get(`/api/category/get-all`);
      } else if (path === "orders") {
        result = await axios.get(`/api/auth/get-all-orders`);
        console.log(result.data);
      }

      setPageData(result.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { data } = await axios.put(`/api/auth/update-order/${orderId}`, {
        status: status,
      });
      toast.success(data.message);
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
        <div>
          <div className={styles.nav}>
            <Link to="/admin">Admin Dashboard</Link>
            <div className={styles.nav_menu}>
              <Link to="/admin/products">Products</Link>
              <Link to="/admin/category">Categories</Link>
              <Link to="/admin/orders">Orders</Link>
            </div>
          </div>

          <div className={styles.admin_dashboard}>
            <div className={styles.left_cnt}>
              <Link to="/admin/add-new/category">Add Category</Link>
              <Link to="/admin/add-new/products">Add Product</Link>
            </div>

            <div className={styles.right_cnt}>
              {path === "" ? (
                // Home Section
                <div className={styles.admin_body}>
                  <div>Admin Name: {admin.username}</div>
                  <div>Admin Email: {admin.email}</div>
                  <div>Admin Contact: {admin.phone}</div>
                </div>
              ) : path === "orders" ? (
                // Orders Page Section
                <div className={styles.orders_sec}>
                  {pageData.map((ord, idx) => (
                    <div className={styles.order} key={ord._id}>
                      <div className={styles.order_header}>
                        <div>#</div>
                        <div>Status</div>
                        <div>Buyer</div>
                        <div>Amount</div>
                        <div>Payment</div>
                        <div>Date</div>
                      </div>

                      <div className={styles.order_detail}>
                        <div>{idx + 1}</div>
                        <select
                          onChange={(e) =>
                            updateOrderStatus(ord._id, e.target.value)
                          }
                          defaultValue={ord?.status}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <div>{ord?.buyer?.username}</div>
                        <div>₹{parseInt(ord?.payment?.amount / 100)}</div>
                        <div>{ord?.payment?.status}</div>
                        <div>{moment(ord?.createdAt).fromNow()}</div>
                      </div>

                      {ord?.products?.map((prodt) => (
                        <Link to="" className={styles.prodt} key={prodt._id}>
                          <div className={styles.img_cnt}>
                            <img
                              src={`/api/products/photo/${prodt._id}`}
                              alt={`${prodt.name}-image`}
                            />
                          </div>
                          <div className={styles.prodt_det}>
                            <div className={styles.name}>{prodt.name}</div>
                            <div className={styles.rating}>
                              {prodt.rating}
                              <FontAwesomeIcon icon={faStar} />
                            </div>
                            <div>Price: ₹{prodt.price}</div>
                            <div>
                              Discount:{" "}
                              <span className={styles.off}>
                                {prodt.discount}% off
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                // Products and Categories Page Section
                pageData && (
                  <div className={styles.data_section}>
                    {pageData?.map((prodt) => (
                      <Link to={`/admin/${path}/${prodt._id}`} key={prodt._id}>
                        <div className={styles.img_cnt}>
                          <img
                            src={`/api/${
                              path === "category" ? "category" : "products"
                            }/photo/${prodt._id}`}
                            alt={prodt?.name}
                            width="auto"
                            height="auto"
                          />
                        </div>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
