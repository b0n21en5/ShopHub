import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  faBoltLightning,
  faCartShopping,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../assets/logo.png";
import styles from "./ProductDetail.module.css";
import toast from "react-hot-toast";
import {
  paymentRoute,
  paymentSuccessRoute,
  productDetailRoute,
  productPhotoRoute,
  similarProductsRoute,
} from "../../constants/constants";

const ProductDetail = () => {
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);

  const { pid } = useParams();
  const path = useLocation().pathname.split("/")[1];

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

  const date = new Date();

  const fetchProductDetail = async () => {
    try {
      const { data } = await axios.get(`${productDetailRoute}/${pid}`);
      try {
        data.desc = JSON.parse(data.desc);
      } catch (e) {}
      setProduct(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, []);

  const fetchSimilarProducts = async () => {
    try {
      const { data } = await axios.get(
        `${similarProductsRoute}/${product.category}/${product._id}`
      );
      setSimilarProducts(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (product.category !== undefined) {
      fetchSimilarProducts();
    }
  }, [product]);

  // Function to add item to cart
  const addTocart = () => {
    let cartArray = [];
    if (localStorage.getItem("cart") !== null) {
      cartArray = JSON.parse(localStorage.getItem("cart"));
    }

    cartArray.push(pid);
    localStorage.setItem("cart", JSON.stringify(cartArray));
    toast.success("item added to cart");
    navigate("/cart");
  };

  // Loading razorpay checkout in new window
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result = await axios.post(paymentRoute, {
      products: [product],
    });

    if (!result) {
      toast.error("Server error. Are you online?");
      return;
    }

    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: "rzp_test_Ao1CK0KgMgwLrb",
      amount: amount.toString(),
      currency: currency,
      name: "ShopHub Corp",
      description: "Test Transaction",
      image: logo,
      order_id: order_id,
      handler: async function (response) {
        const paymentDetails = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.post(paymentSuccessRoute, {
          paymentDetails,
          products: [product],
        });

        if (result.data.status === "Payment successful") {
          toast.success("Order Placed!");
          navigate("/account/orders");
        }
      },
      prefill: {
        name: "",
        email: "splitter@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new Razorpay(options);
    paymentObject.open();
  }

  return (
    <>
      {/* Product Details */}
      <div className={styles.details_cnt}>
        <div className={styles.details}>
          <div className={styles.detail_left}>
            <div className={styles.img_cnt}>
              <img
                src={product._id ? `${productPhotoRoute}/${product?._id}` : ""}
                alt={product?.name}
              />
            </div>
            <div className={styles.cta_btn_cnt}>
              <button
                onClick={addTocart}
                className={`${styles.add_cart} ${styles.btn}`}
              >
                <FontAwesomeIcon icon={faCartShopping} />
                ADD TO CART
              </button>
              <button
                className={`${styles.buy_now} ${styles.btn}`}
                onClick={displayRazorpay}
              >
                <FontAwesomeIcon icon={faBoltLightning} />
                BUY NOW
              </button>
            </div>
          </div>
          <div className={styles.detail_right}>
            <div className={styles.p_name}>{product.name}</div>
            <div className={`${styles.rating}`}>
              {product.rating}
              <FontAwesomeIcon icon={faStar} />
            </div>
            <div className={styles.off}>Special price</div>
            <div className={styles.pd_price}>
              <span className={styles.pay}>
                {" "}
                ₹
                {product.discount
                  ? parseInt((product.price * (100 - product.discount)) / 100)
                  : product.price}
              </span>
              <strike>₹{product.price}</strike>
              <span className={styles.off}> {product.discount}% off</span>
            </div>

            {/* Deilvery section */}
            <div className={styles.sec}>
              <div className={styles.secLeft}>Delivery</div>
              <div className={styles.secRight}>
                Delivery by{" "}
                {(() => {
                  const deliveryDate = new Date();
                  deliveryDate.setDate(date.getDate() + product.delivery);
                  const day = deliveryDate.getDate();
                  const month = months[deliveryDate.getMonth()];
                  return `${day} ${month}`;
                })()}{" "}
                | <span className={styles.off}>Free</span> <strike>40</strike>
              </div>
            </div>
            {/* Quantuity section */}
            <div className={styles.sec}>
              <div className={styles.secLeft}>Quantity</div>
              <div className={styles.secRight}>{product.quantity}</div>
            </div>

            {/* Product Specifications */}
            <div className={styles.specs_cnt}>
              <div className={styles.spec_heading}>Specifications</div>
              <div className={styles.specs}>
                {product.desc?.ram && <span>Ram: {product.desc?.ram}</span>}
                {product.desc?.storage && (
                  <span className={styles.grey}>
                    Storage: {product.desc?.storage}
                  </span>
                )}
                {product.desc?.camera && (
                  <span className={styles.grey}>
                    Camera: {product.desc?.camera}
                  </span>
                )}
                {product.desc?.battery && (
                  <span className={styles.grey}>
                    Battery: {product.desc?.battery}
                  </span>
                )}
                {product.desc?.cpu && (
                  <span className={styles.grey}>CPU: {product.desc?.cpu}</span>
                )}
                {product.desc?.quantity && (
                  <span className={styles.grey}>
                    Net Quantity: {product.desc?.quantity}
                  </span>
                )}
                {product.desc?.weight && (
                  <span className={styles.grey}>
                    Weight: {product.desc?.weight}
                  </span>
                )}
                {product.desc?.type && (
                  <span className={styles.grey}>
                    Type: {product.desc?.type}
                  </span>
                )}
                {product.desc?.flavor && (
                  <span className={styles.grey}>
                    Flavor: {product.desc?.flavor}
                  </span>
                )}
                {product.desc?.preferrance && (
                  <span className={styles.grey}>
                    Preferrance: {product.desc?.preferrance}
                  </span>
                )}
                {product.desc?.pack && (
                  <span className={styles.grey}>
                    Pack: {product.desc?.pack}
                  </span>
                )}
                {product.desc?.warranty && (
                  <span className={styles.grey}>
                    Warranty: {product.desc?.warranty}
                  </span>
                )}
                {product?.desc?.size && (
                  <span className={styles.grey}>
                    Size:{" "}
                    {product?.desc?.size?.map((s) => s.toUpperCase() + ", ")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className={styles.similar_products_section}>
        <div className={styles.heading}>Similar Products</div>
        <div className={styles.similar_products_cnt}>
          {similarProducts.map((prodt) => (
            <Link
              to={`/${path}/${prodt._id}`}
              target="_blank"
              className={styles.similar_product}
              key={prodt._id}
            >
              <div className={styles.img_cnt}>
                <img
                  src={`${productPhotoRoute}/${prodt._id}`}
                  alt={prodt.name}
                />
              </div>
              <div>
                {prodt.name.length > 61
                  ? prodt.name.substr(0, 62) + "..."
                  : prodt.name}
              </div>
              <div className={styles.review}>
                <div className={styles.rating}>
                  {prodt.rating}
                  <FontAwesomeIcon icon={faStar} />
                </div>
              </div>
              <div className={styles.price_cnt}>
                <span>
                  ₹{parseInt((prodt.price * (100 - prodt.discount)) / 100)}
                </span>
                <strike className={styles.price}>{prodt.price}</strike>
                <span className={styles.off}>{prodt.discount}% off</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
