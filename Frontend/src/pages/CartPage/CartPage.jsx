import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import RemoveItem from "../../Components/RemoveItem/RemoveItem";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import styles from "./CartPage.module.css";

const CartPage = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [pricing, setPricing] = useState({
    price: 0,
    discount: 0,
    total: 0,
    items: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);

  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const date = new Date();

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

  useEffect(() => {
    if (localStorage.getItem("cart") !== null) {
      getCartProducts(JSON.parse(localStorage.getItem("cart")));
    }
    fetchRecentProducts();
  }, []);

  const getCartProducts = async (cartItems) => {
    try {
      const { data } = await axios.get(
        `/api/products/get-multiple?ids=${cartItems}`
      );
      setCartProducts(data);
    } catch (error) {
      toast.error(error.response.data.message);
      setCartProducts([]);
    }
  };

  const fetchRecentProducts = async () => {
    try {
      const { data } = await axios.get("/api/products/get-recently-added");
      setRecentProducts(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const removeFromCart = (productId) => {
    let cartItem = JSON.parse(localStorage.getItem("cart"));
    cartItem = cartItem.filter((item) => item !== productId);
    localStorage.setItem("cart", JSON.stringify(cartItem));
    getCartProducts(cartItem);
    setShowRemoveModal(false);
    toast.success("item removed from cart");
  };

  const countPriceDetails = () => {
    if (cartProducts.length) {
      let price = 0,
        total = 0,
        discount = 0;
      cartProducts.forEach((prdt) => {
        price += prdt.price;
        total += parseInt((prdt.price * (100 - prdt.discount)) / 100);
        discount += Math.ceil((prdt.price * prdt.discount) / 100);
      });
      setPricing((prev) => ({
        ...prev,
        items: cartProducts.length,
        price: price,
        discount: discount,
        total: total,
      }));
    } else {
      setPricing({
        price: 0,
        discount: 0,
        total: 0,
        items: 0,
      });
    }
  };

  useEffect(() => {
    countPriceDetails();
  }, [cartProducts]);

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

  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result = await axios.post("/api/products/payment", {
      products: cartProducts,
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

        const result = await axios.post("/api/products/payment/success", {
          paymentDetails,
          products: cartProducts,
        });

        if (result.data.status === "Payment successful") {
          toast.success("Order Placed!");
          localStorage.removeItem("cart");
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
  };

  return (
    <>
      <div className={styles.cart_cnt}>
        {!cartProducts.length ? (
          <div className={styles.missing}>
            <img
              width={222}
              height={162}
              src="/src/assets/cart.webp"
              alt="no-item-in-cart"
            />
            <div className={styles.head}>
              {!user ? "Missing Cart items?" : "Your cart is empty!"}
            </div>
            <span>
              {!user
                ? "Login to see things you added previously"
                : "Add items to it now."}
            </span>
            {!user ? (
              <Link to="/login">Login</Link>
            ) : (
              <Link to="/" style={{ background: "#2874f0" }}>
                Shop now
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className={styles.cart_details}>
              {cartProducts.map((prodt) => (
                <div key={prodt._id} className={styles.bor_btm}>
                  <div className={styles.product}>
                    <img
                      src={`/api/products/photo/${prodt._id}`}
                      alt={prodt.name}
                      width={100}
                      height={120}
                    />

                    {/* Details about product */}
                    <div className={styles.product_det}>
                      <div className={styles.det_top}>
                        <span>{prodt.name}</span>
                        <span>
                          Delivery by{" "}
                          {`${date.getDate() + prodt.delivery} ${
                            months[date.getMonth()]
                          }`}
                        </span>
                      </div>
                      <div className={styles.price_cnt}>
                        {prodt.discount && <strike>{prodt.price}</strike>}
                        <div>
                          ₹
                          {prodt.discount
                            ? parseInt(
                                (prodt.price * (100 - prodt.discount)) / 100
                              )
                            : prodt.price}
                          {prodt.discount && (
                            <span className={styles.off}>
                              {prodt.discount}% off
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* change quantity and remove from cart */}
                  <div className={styles.cart_item_action}>
                    <div className={styles.cart_quantity}></div>
                    <div
                      className={styles.remove}
                      onClick={() => setShowRemoveModal(true)}
                    >
                      REMOVE
                    </div>
                  </div>

                  {showRemoveModal && (
                    <RemoveItem
                      setShowRemoveModal={setShowRemoveModal}
                      removeFromCart={removeFromCart}
                      productId={prodt._id}
                    />
                  )}
                </div>
              ))}

              {/* Place order section */}
              <div className={styles.place_cnt}>
                <div className={styles.place_btn} onClick={displayRazorpay}>
                  PLACE ORDER
                </div>
              </div>
            </div>

            <div className={styles.price_details_cnt}>
              <div className={styles.price_details}>
                <div className={styles.price_top}>PRICE DETAILS</div>
                <div className={styles.price_main}>
                  <div className={styles.justify_between}>
                    <div>Price ({pricing.items} items)</div>{" "}
                    <div>₹{pricing.price}</div>
                  </div>
                  <div className={styles.justify_between}>
                    <div>Discount</div>
                    <div className={styles.save}>-₹{pricing.discount}</div>
                  </div>
                  <div className={styles.justify_between}>
                    <div>Delivery Charges</div>
                    <div>
                      <strike>100</strike>
                      <span className={styles.save}> Free</span>
                    </div>
                  </div>
                  <div className={`${styles.amount} ${styles.justify_between}`}>
                    <div>Total Amount</div>
                    <div>₹{pricing.total}</div>
                  </div>
                  <div className={styles.save}>
                    You will save ₹{pricing.discount} on this order
                  </div>
                </div>
              </div>

              <div className={styles.authentic}>
                <FontAwesomeIcon icon={faSquareCheck} />
                Safe and Secure Payments.Easy returns.100% Authentic products.
              </div>

              {/* Mobile Order Place Section */}
              <div className={styles.mb_place_cnt}>
                <div className={styles.price}>
                  <strike>{pricing.price}</strike>
                  <div className={styles.total}>{pricing.total}</div>
                </div>
                <div className={styles.mb_place_btn} onClick={displayRazorpay}>
                  PLACE ORDER
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recently Added Products Section */}
      <>
        <div className={styles.recent_products_heading}>Recently Added</div>
        <div className={styles.recent_products_cnt}>
          {recentProducts.map((prodt) => (
            <div className={styles.recent_product}>
              <img
                src={`/api/products/photo/${prodt._id}`}
                alt={prodt.name}
                width={120}
                height={148}
              />
              <div className={styles.prodt_name}>
                {prodt.name.length > 16
                  ? prodt.name.substr(0, 15) + "..."
                  : prodt.name}
              </div>
              <div className={styles.price_cnt}>
                <div>
                  ₹
                  {prodt.discount
                    ? parseInt((prodt.price * (100 - prodt.discount)) / 100)
                    : prodt.price}
                  {prodt.discount && <strike>{prodt.price}</strike>}
                </div>
              </div>
              {prodt.discount && (
                <div style={{ color: "rgb(0, 140, 0)", fontSize: "12px" }}>
                  {prodt.discount}% off
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    </>
  );
};

export default CartPage;
