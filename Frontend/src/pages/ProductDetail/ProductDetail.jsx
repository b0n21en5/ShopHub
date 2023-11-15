import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  faBoltLightning,
  faCartShopping,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../assets/logo.png";
import styles from "./ProductDetail.module.css";

const ProductDetail = () => {
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);

  const { pid } = useParams();

  const navigate = useNavigate();

  const fetchProductDetail = async () => {
    try {
      const { data } = await axios.get(`/api/products/get-product/${pid}`);
      data.desc = JSON.parse(data.desc);
      setProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductDetail();
  }, []);

  const fetchSimilarProducts = async () => {
    try {
      const { data } = await axios.get(
        `/api/products/similar-products/${product.category}/${product._id}`
      );
      setSimilarProducts(data);
    } catch (error) {
      console.log(error);
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
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result = await axios.post("/api/products/payment", {
      products: [product],
    });

    if (!result) {
      alert("Server error. Are you online?");
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

        const result = await axios.post("/api/products/payment/success", {
          paymentDetails,
          products: [product],
        });

        alert(result.data.status);
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
            <img
              src={product._id ? `/api/products/photo/${product?._id}` : ""}
              alt={product?.name}
              width={400}
              height={370}
            />
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
            <span>Model: {product.name}</span>
            <span>Price: {product.price}</span>
            <span>Ram: {product.desc?.ram}</span>
            <span>Storage: {product.desc?.storage}</span>
            <span>Camera: {product.desc?.camera}</span>
            <span>Battery: {product.desc?.battery}</span>
            <span>CPU: {product.desc?.cpu}</span>
            <span>Quantity: {product.quantity}</span>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className={styles.similar_products_section}>
        <div className={styles.heading}>Similar Products</div>
        <div className={styles.similar_products_cnt}>
          {similarProducts.map((prodt) => (
            <div className={styles.similar_product} key={prodt._id}>
              <div className={styles.img_cnt}>
                <img
                  src={`/api/products/photo/${prodt._id}`}
                  alt={prodt.name}
                  width={140}
                  height={180}
                />
              </div>
              <div>{prodt.name}</div>
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
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
