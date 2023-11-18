import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faCircle,
  faFilter,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Checkbox } from "antd";
import toast from "react-hot-toast";
import styles from "./Order.module.css";
import moment from "moment";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filterApplied, setFilterApplied] = useState([]);
  const [filter, setFilter] = useState({
    status: [],
    search: "",
    time: [],
    mbVisible: false,
  });

  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const orderStatus = ["On the way", "Delivered", "Cancelled", "Returned"];
  const orderTime = [
    { title: "Last 30 Days", value: 30 },
    { title: "2023", value: 365 },
  ];

  const getAllOrders = async () => {
    try {
      const { data } = await axios.get(
        `/api/auth/single-user-orders?search=${filter.search}&status=${filter.status}&time=${filter.time}`
      );
      setOrders(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user]);

  const handleStatusChecked = (e, value) => {
    if (e.target.checked) {
      setFilter((prev) => ({
        ...prev,
        status: [...prev.status, value],
      }));
      setFilterApplied([...filterApplied, value]);
    } else {
      setFilter((prev) => ({
        ...prev,
        status: filter.status.filter((st) => st !== value),
      }));
      setFilterApplied(filterApplied.filter((filt) => filt !== value));
    }
  };

  const handleOrderTimeChecked = (e, item) => {
    if (e.target.checked) {
      setFilter((prev) => ({ ...prev, time: [...prev.time, item.value] }));
      setFilterApplied([...filterApplied, item.title]);
    } else {
      setFilter((prev) => ({
        ...prev,
        time: prev.time.filter((cr) => cr !== item.value),
      }));
      setFilterApplied(filterApplied.filter((filt) => filt !== item.title));
    }
  };

  useEffect(() => {
    if (!filter.search) getAllOrders();
    else if (window.innerWidth <= 412) getAllOrders();
  }, [filter]);

  // Function to remove applied filter
  const removeAppliedFilter = (filterName) => {
    setFilterApplied(filterApplied.filter((filt) => filt !== filterName));

    if (filter.status.length) {
      setFilter((prev) => ({
        ...prev,
        status: prev.status.filter((filt) => filt !== filterName),
      }));
    }

    if (filter.time.length) {
      let filtValue;
      orderTime.forEach((it) => {
        if (it.title === filterName) {
          filtValue = it.value;
          return;
        }
      });

      setFilter((prev) => ({
        ...prev,
        time: prev.time.filter((filt) => filt !== filtValue),
      }));
    }
  };

  const handleClearBtn = () => {
    setFilter({ search: "", status: [], time: [], mbVisible: false });
    setFilterApplied([]);
  };

  return (
    <>
      <div className={styles.links}>
        <Link to="/">Home</Link>
        <FontAwesomeIcon icon={faAngleRight} />
        <Link to="/account/profile">My Account</Link>
        <FontAwesomeIcon icon={faAngleRight} />
        <Link to="/account/orders">My Orders</Link>
      </div>
      <div className={styles.order_cnt}>
        {/* Filters Section */}
        <div
          className={`${styles.order_left} ${
            filter.mbVisible ? "" : styles.d_non
          }`}
        >
          <div className={styles.filter_section}>
            <div className={styles.filter_types}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className={styles.filter_head}>Filters</div>
                {filterApplied.length ? (
                  <div className={styles.clear_all} onClick={handleClearBtn}>
                    CLEAR ALL
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.applied_filters}>
                {filterApplied &&
                  filterApplied?.map((filt, ind) => (
                    <div
                      key={ind}
                      className={styles.btn_lgt}
                      onClick={() => removeAppliedFilter(filt)}
                    >
                      <FontAwesomeIcon
                        icon={faXmark}
                        style={{ marginRight: "4px" }}
                      />
                      {filt}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className={styles.filter_section}>
            <div className={styles.section_head}>ORDER STATUS</div>
            <div className={styles.options}>
              {orderStatus.map((status, idx) => (
                <Checkbox
                  key={idx}
                  checked={filter.status.includes(status)}
                  onChange={(e) => handleStatusChecked(e, status)}
                >
                  {status}
                </Checkbox>
              ))}
            </div>
          </div>
          <div className={styles.filter_section}>
            <div className={styles.section_head}>ORDER TIME</div>
            <div className={styles.options}>
              {orderTime.map((item) => (
                <Checkbox
                  key={item.value}
                  checked={filter.time.includes(item.value)}
                  onChange={(e) => handleOrderTimeChecked(e, item)}
                >
                  {item.title}
                </Checkbox>
              ))}
            </div>
          </div>

          {/* Mobile Apply button */}
          <div
            className={styles.mb_apply_btn}
            onClick={() => setFilter((p) => ({ ...p, mbVisible: false }))}
          >
            Apply
          </div>
        </div>

        <div className={styles.order_right}>
          {/* Search Bar of the page*/}
          <div className={styles.search_bar}>
            <input
              type="text"
              placeholder="Search your orders here"
              onChange={(e) =>
                setFilter((p) => ({ ...p, search: e.target.value }))
              }
              value={filter.search}
            />
            {filter.search && (
              <FontAwesomeIcon
                className={styles.cross}
                icon={faXmark}
                onClick={() => {
                  setFilter((p) => ({ ...p, search: "" }));
                }}
              />
            )}
            <div className={styles.search_btn} onClick={() => getAllOrders()}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              Search Orders
            </div>

            {/* Mobile Filter button */}
            <div
              className={styles.mb_filter}
              onClick={() =>
                setFilter((p) => ({ ...p, mbVisible: !p.mbVisible }))
              }
            >
              <FontAwesomeIcon icon={faFilter} />
              Filters
            </div>
          </div>

          {/* All orders listing */}
          {orders.length ? (
            <>
              {orders?.map((item) => {
                return item?.products?.map((ord) => (
                  <div className={styles.all_orders} key={ord._id}>
                    <div className={styles.img_cnt}>
                      <img
                        src={`/api/products/photo/${ord._id}`}
                        alt={ord.name}
                        width="auto"
                        height="auto"
                      />
                    </div>
                    <div className={styles.product_details}>
                      <div className={styles.product}>
                        {ord.name.length > 20
                          ? ord.name.substr(0, 40) + "..."
                          : ord.name}
                      </div>
                      <div className={styles.price}>
                        ₹{parseInt((ord.price * (100 - ord.discount)) / 100)}
                      </div>
                      <div>
                        <div className={`${styles.date} `}>
                          <FontAwesomeIcon
                            icon={faCircle}
                            className={styles[item?.status]}
                          />
                          {` ${item.status} on ${moment(item.updatedAt).format(
                            "DD MMM YYYY"
                          )}`}
                        </div>
                        {item.status === "Delivered" ? (
                          <div style={{ fontSize: "12px" }}>
                            Your item has been delivered
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                ));
              })}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Order;
