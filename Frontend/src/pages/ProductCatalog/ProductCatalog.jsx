import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faArrowDownWideShort,
  faFilter,
  faStar,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Checkbox, Col, InputNumber, Radio, Row, Slider } from "antd";
import NoResults from "../../Components/NoResults/NoResults";
import axios from "axios";

import styles from "./ProductCatalog.module.css";
import toast from "react-hot-toast";

const ProductCatalog = () => {
  const [fetchedData, setFetchedData] = useState([]);
  const [sort, setSort] = useState({ by: "rating", order: "desc" });
  const [sliceVal, setSliceVal] = useState(6);

  const [pricing, setPricing] = useState({ min: 50, max: 70000 });
  const [brands, setBrands] = useState({
    data: [],
    isVisible: true,
    checks: [],
  });
  const [discounts, setDiscounts] = useState({ isVisible: true, checks: [] });
  const [filterApplied, setFilterApplied] = useState([]);
  const [rating, setRating] = useState({ sel: 1, isVisible: true });
  const [mbVisible, setMbVisible] = useState({ sort: false, filter: false });

  const path = useLocation().pathname.substr(1);

  const fetchProductsWithFilters = async () => {
    let catId = await getCategoryId();

    try {
      const { data } = await axios.get(
        `/api/products/filter-products?cid=${catId}&price=${pricing.min},${pricing.max}&sortBy=${sort.by}&order=${sort.order}&rating=${rating.sel}&discount=${discounts.checks}&brand=${brands.checks}`
      );

      let newData = data.map((item) => {
        try {
          const parsedDesc = JSON.parse(item.desc);
          return { ...item, desc: parsedDesc };
        } catch (e) {
          return item;
        }
      });
      setFetchedData(newData);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const getCategoryId = async () => {
    try {
      const { data } = await axios.get("/api/category/get-all");
      const cat = data.find((dt) => dt.slug == path);

      if (cat) return cat._id;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchAllBrands = async () => {
    let catId = await getCategoryId();
    try {
      const { data } = await axios.get(
        `/api/products/get-all-brands?catId=${catId}`
      );
      setBrands({ ...brands, data: data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchAllBrands();
    fetchProductsWithFilters();
  }, []);

  useEffect(() => {
    fetchProductsWithFilters();
  }, [
    sort,
    pricing,
    rating.sel,
    discounts.checks.length,
    brands.checks.length,
  ]);

  useEffect(() => {
    fetchProductsWithFilters();
    fetchAllBrands();
  }, [path]);

  const handleMinPrice = (value) => {
    if (value >= pricing.max) {
      setPricing({ ...pricing, min: pricing.max });
    } else {
      setPricing({ ...pricing, min: value });
    }
  };

  const handleMaxPrice = (value) => {
    if (value <= pricing.min) {
      setPricing({ ...pricing, max: pricing.min });
    } else {
      setPricing({ ...pricing, max: value });
    }
  };

  // Function to handle rating checks
  const handleRatingCheck = (val) => {
    let star4 = "4* & above";
    let star3 = "3* & above";

    if (val === 3) {
      setFilterApplied([...filterApplied].filter((filt) => filt !== star4));
      setFilterApplied((prev) => [...prev, star3]);
    } else {
      setFilterApplied([...filterApplied].filter((filt) => filt !== star3));
      setFilterApplied((prev) => [...prev, star4]);
    }
  };

  // Function to handle discount checks
  const handleDiscountChecks = (checked, val, label) => {
    if (checked) {
      if (!discounts.checks.includes(val))
        setDiscounts((prev) => ({ ...prev, checks: [...prev.checks, val] }));

      if (!filterApplied.includes(label))
        setFilterApplied((prev) => [...prev, label]);
    } else {
      if (discounts.checks.includes(val))
        setDiscounts((prev) => ({
          ...prev,
          checks: prev.checks.filter((rm) => rm !== val),
        }));

      if (filterApplied.includes(label))
        setFilterApplied([...filterApplied].filter((filt) => filt !== label));
    }
  };

  // Function to remove applied filter
  const removeAppliedFilter = (filterName) => {
    setFilterApplied(filterApplied.filter((fa) => fa !== filterName));

    if (filterName == "4* & above" || filterName == "3* & above") {
      setRating((prev) => ({ ...prev, sel: 1 }));
    }

    if (brands.checks.length)
      setBrands((prev) => ({
        ...prev,
        checks: prev.checks.filter((chk) => chk !== filterName),
      }));

    if (discounts.checks.length) {
      const [filtName] = filterName.split(" ");
      setDiscounts((prev) => ({
        ...prev,
        checks: prev.checks.filter((ram) => ram !== Number(filtName)),
      }));
    }
  };

  // Function to handle checked brand
  const handleBrandChecked = (checked, name) => {
    if (checked) {
      if (!brands.checks.includes(name))
        setBrands((prev) => ({ ...prev, checks: [...prev.checks, name] }));
      if (!filterApplied.includes(name))
        setFilterApplied((prev) => [...prev, name]);
    } else if (brands.checks.includes(name)) {
      setBrands((prev) => ({
        ...prev,
        checks: brands.checks.filter((ch) => ch !== name),
      }));

      if (filterApplied.includes(name))
        setFilterApplied([...filterApplied].filter((filt) => filt !== name));
    }
  };

  const handleClearBtn = () => {
    setFilterApplied([]);
    setPricing({ min: 100, max: 50000 });
    setBrands((p) => ({ ...p, checks: [] }));
    setDiscounts((p) => ({ ...p, checks: [] }));
    setRating((p) => ({ ...p, sel: 1 }));
  };

  const handleSortOptionClick = (sortBy, sortOrder) => {
    setSort({ by: sortBy, order: sortOrder });

    if (window.innerWidth <= 412) {
      setMbVisible({ sort: false, filter: false });
    }
  };

  return (
    <div>
      <div className={styles.mb_row}>
        {/* Desktop Filters options */}
        <div
          className={`${styles.filters_cnt} ${
            mbVisible.filter ? "" : styles.d_non
          }`}
        >
          <div
            className={`${styles.filter_type} ${styles.bd_bottom} ${styles.flex_column}`}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "18px" }}>Filters </div>
              {filterApplied.length ? (
                <div className={styles.clear_all} onClick={handleClearBtn}>
                  CLEAR ALL
                </div>
              ) : (
                ""
              )}
            </div>
            <div className={styles.filter_applied}>
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

          {/* Price Filter section */}
          <div className={`${styles.all_brands} ${styles.bd_bottom}`}>
            <label className={styles.filter_type}>PRICE</label>
            <Row>
              <Col span={24}>
                <Slider
                  trackStyle={{ backgroundColor: "#077bff" }}
                  range
                  min={50}
                  max={70000 - 1}
                  value={[pricing.min, pricing.max]}
                  onChange={([newMin, newMax]) =>
                    setPricing({ ...pricing, min: newMin, max: newMax })
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col span={4}>
                <InputNumber
                  min={0}
                  max={pricing.max - 1}
                  value={pricing.min}
                  onChange={handleMinPrice}
                />
              </Col>
              <Col span={10}></Col>
              <Col span={4}>
                <InputNumber
                  min={pricing.min + 1}
                  max={70000}
                  value={pricing.max}
                  onChange={handleMaxPrice}
                />
              </Col>
            </Row>
          </div>

          {/* Brand Filter section */}
          <div className={`${styles.all_brands} ${styles.bd_bottom}`}>
            <label
              onClick={() => {
                setBrands({ ...brands, isVisible: !brands.isVisible });
                setSliceVal(6);
              }}
              className={styles.filter_type}
            >
              BRAND{" "}
              <FontAwesomeIcon
                style={{ color: "gray" }}
                icon={brands.isVisible ? faAngleUp : faAngleDown}
              />
            </label>
            {brands.isVisible &&
              brands.data.slice(0, sliceVal).map((brnd, idx) => (
                <Checkbox
                  key={idx}
                  onClick={(e) =>
                    handleBrandChecked(e.target.checked, e.target.name)
                  }
                  name={brnd}
                  checked={brands.checks.includes(brnd)}
                >
                  {brnd}
                </Checkbox>
              ))}
            {brands.isVisible && (
              <div
                className={styles.btn}
                onClick={() => {
                  if (sliceVal === 6) setSliceVal(brands.length);
                  else setSliceVal(6);
                }}
                style={{ color: "blue" }}
              >
                {sliceVal === brands.data.length
                  ? "Show less"
                  : sliceVal > brands.data.length
                  ? ""
                  : "Show all"}
              </div>
            )}
          </div>

          {/* Customer Ratings section */}
          <div className={`${styles.all_brands} ${styles.bd_bottom}`}>
            <label
              className={styles.filter_type}
              onClick={() =>
                setRating((prev) => ({ ...prev, isVisible: !prev.isVisible }))
              }
            >
              CUSTOMER RATINGS
              <FontAwesomeIcon
                style={{ color: "gray" }}
                icon={rating.isVisible ? faAngleUp : faAngleDown}
              />
            </label>
            {rating.isVisible && (
              <Radio.Group
                value={rating.sel}
                onChange={(e) =>
                  setRating((prev) => ({ ...prev, sel: e.target.value }))
                }
              >
                {" "}
                <Radio
                  value={4}
                  onChange={(e) => handleRatingCheck(e.target.value)}
                >
                  4
                  <FontAwesomeIcon
                    icon={faStar}
                    style={{ marginLeft: "3px" }}
                  />{" "}
                  & above
                </Radio>
                <Radio
                  value={3}
                  onChange={(e) => handleRatingCheck(e.target.value)}
                >
                  3
                  <FontAwesomeIcon
                    icon={faStar}
                    style={{ marginLeft: "3px" }}
                  />{" "}
                  & above
                </Radio>
              </Radio.Group>
            )}
          </div>

          {/* Discount filter section */}
          <div className={`${styles.all_brands} ${styles.bd_bottom}`}>
            <label
              className={styles.filter_type}
              onClick={() =>
                setDiscounts((prev) => ({
                  ...prev,
                  isVisible: !prev.isVisible,
                }))
              }
            >
              DISCOUNT
              <FontAwesomeIcon
                style={{ color: "gray" }}
                icon={discounts.isVisible ? faAngleUp : faAngleDown}
              />
            </label>
            {discounts.isVisible && (
              <>
                <Checkbox
                  onClick={(e) =>
                    handleDiscountChecks(e.target.checked, 20, "20% or more")
                  }
                  checked={discounts.checks.includes(20)}
                >
                  20% or more
                </Checkbox>
                <Checkbox
                  onClick={(e) =>
                    handleDiscountChecks(e.target.checked, 15, "15% or more")
                  }
                  checked={discounts.checks.includes(15)}
                >
                  15% or more
                </Checkbox>
                <Checkbox
                  onClick={(e) =>
                    handleDiscountChecks(e.target.checked, 10, "10% or more")
                  }
                  checked={discounts.checks.includes(10)}
                >
                  10% or more
                </Checkbox>
                <Checkbox
                  onClick={(e) =>
                    handleDiscountChecks(e.target.checked, 5, "5% or more")
                  }
                  checked={discounts.checks.includes(5)}
                >
                  5% or more
                </Checkbox>
              </>
            )}
          </div>

          {/* Mobile Display Apply button */}
          <div
            className={styles.mb_apply_btn}
            onClick={() => setMbVisible({ sort: false, filter: false })}
          >
            Apply
          </div>
        </div>

        {/* Mobile Filter Options */}
        <div className={styles.mb_filters_cnt}>
          <div
            className={styles.mb_sorting}
            onClick={() => setMbVisible((p) => ({ filter:false, sort: !p.sort }))}
          >
            <FontAwesomeIcon icon={faArrowDownWideShort} />
            Sort
          </div>
          <div
            className={styles.mb_filters}
            onClick={() => setMbVisible((p) => ({ sort:false, filter: !p.filter }))}
          >
            <FontAwesomeIcon icon={faFilter} />
            Filter
          </div>
        </div>

        <div className={styles.pd_cnt}>
          <div className={styles.results}>
            {path}&nbsp;
            <span>
              (Showing 1 -{" "}
              {`${fetchedData.length > 10 ? 10 : fetchedData.length} of ${
                fetchedData.length
              } products`}
              )
            </span>
          </div>

          {/* Sorting products section */}
          <div
            className={`${styles.sorting} ${
              mbVisible.sort ? "" : styles.d_non
            }`}
          >
            <label>Sort By</label>
            <div
              className={`${styles.sortVal} ${
                sort.by === "rating" ? styles.sort_active : ""
              }`}
              onClick={() => handleSortOptionClick("rating", "desc")}
            >
              Popularity
            </div>
            <div
              className={`${styles.sortVal} ${
                sort.by === "price" && sort.order === "asc"
                  ? styles.sort_active
                  : ""
              }`}
              onClick={() => handleSortOptionClick("price", "asc")}
            >
              Price -- Low to High
            </div>
            <div
              className={`${styles.sortVal} ${
                sort.by === "price" && sort.order === "desc"
                  ? styles.sort_active
                  : ""
              }`}
              onClick={() => handleSortOptionClick("price", "desc")}
            >
              Price -- High to Low
            </div>
            <div
              className={`${styles.sortVal} ${
                sort.by === "createdAt" ? styles.sort_active : ""
              }`}
              onClick={() => handleSortOptionClick("createdAt", "asc")}
            >
              Newest First
            </div>
          </div>

          {/* Products Container section */}
          {fetchedData.length ? (
            <div
              className={
                path !== "Mobiles" && window.innerWidth > 450
                  ? styles.d_flex
                  : ""
              }
            >
              {fetchedData?.map((item) => (
                <Link
                  to={`/${path}/${item._id}`}
                  target="_blank"
                  key={item._id}
                  className={styles.pd_body}
                >
                  <div className={styles.img_cnt}>
                    <img
                      src={`/api/products/photo/${item._id}`}
                      width="auto"
                      height="auto"
                      alt={item.name}
                    />
                  </div>
                  <div className={styles.pd_details_cnt}>
                    <div className={styles.pd_details}>
                      <div className={styles.pd_title}>
                        <div className={styles.pd_name}>
                          {window.innerWidth > 430
                            ? path === "Mobiles"
                              ? item.name.substr(0, 87) +
                                `${item.name.length > 86 ? "..." : ""}`
                              : item.name.substr(0, 20) +
                                `${item.name.length > 19 ? "..." : ""}`
                            : item.name.substr(0, 87) +
                              `${item.name.length > 86 ? "..." : ""}`}
                        </div>
                        <div className={`${styles.btn} ${styles.btn_success}`}>
                          {item.rating}
                          <FontAwesomeIcon
                            icon={faStar}
                            style={{ marginLeft: "3px" }}
                          />
                        </div>
                      </div>
                      {path === "Mobiles" && (
                        <ul>
                          <li>
                            {item?.desc?.ram} RAM | {item?.desc?.storage} ROM{" "}
                          </li>
                          <li>{item?.desc?.camera} Camera</li>
                          <li>{item?.desc?.battery} Li-ion Ploymer Battery</li>
                          <li>{item?.desc?.cpu} Processor</li>
                        </ul>
                      )}
                      {path === "Fashion" && (
                        <div>
                          Size:{" "}
                          {item?.desc?.size?.map((i) => i.toUpperCase() + ", ")}
                        </div>
                      )}
                    </div>
                    <div className={styles.pd_pricing}>
                      <div className={styles.pd_price}>
                        <h4>
                          {" "}
                          ₹
                          {item.discount
                            ? parseInt(
                                (item.price * (100 - item.discount)) / 100
                              )
                            : item.price}
                        </h4>
                        <div>
                          <strike style={{ color: "gray" }}>
                            {item.price}
                          </strike>
                          <span className={styles.off}>
                            {" "}
                            {item.discount}% off
                          </span>
                        </div>
                      </div>
                      <div>Delivery in {item.delivery} days </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <NoResults />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
