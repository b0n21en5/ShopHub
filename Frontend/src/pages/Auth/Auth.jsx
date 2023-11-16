import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import toast from "react-hot-toast";
import styles from "./Auth.module.css";

const Auth = () => {
  const [auth, setAuth] = useState({
    login: "",
    password: "",
    showPass: false,
    username: "",
    email: "",
    phone: "",
    address: "",
    answer: "",
  });

  const dispatch = useDispatch();

  let path = useLocation().pathname.split("/");
  path = path[1];

  const navigate = useNavigate();

  const handleInputFields = (e, targetPlace) => {
    setAuth((prev) => ({ ...prev, [targetPlace]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/login", {
        email: auth.login,
        phone: parseInt(auth.login),
        password: auth.password,
      });

      if (data) {
        dispatch(setUser(data));
        toast.success(`${data.username} logged in!`);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleNewUserRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/register", {
        username: auth.username,
        email: auth.email,
        phone: auth.phone,
        password: auth.password,
        address: auth.address,
        answer: auth.answer,
      });

      if (data) {
        toast.success(data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    setAuth({
      login: "",
      password: "",
      showPass: false,
      username: "",
      email: "",
      phone: "",
      address: "",
      answer: "",
    });
  }, [path]);

  return (
    <div className={styles.auth_cnt}>
      <div className={styles.auth_left}>
        <div>
          <div className={styles.head}>
            {path === "login" ? "Login" : "Looks like you're new here!"}
          </div>
          <div className={styles.sub_head}>
            {path === "login"
              ? "Get access to your Orders, Wishlist and Recommendations"
              : "Sign up with your mobile number to get started"}
          </div>
        </div>
        <img width={220} height={130} src="./src/assets/auth.png" alt="auth" />
      </div>
      <form
        className={styles.auth_right}
        onSubmit={(e) =>
          path === "login" ? handleLogin(e) : handleNewUserRegister(e)
        }
      >
        {path === "login" ? (
          <>
            <input
              type="text"
              autoFocus
              placeholder="Enter Email/Mobile number"
              onChange={(e) => handleInputFields(e, "login")}
              value={auth.login}
            />
            <div style={{ display: "flex" }}>
              <input
                type={`${auth.showPass ? "text" : "password"}`}
                placeholder="Enter Password"
                onChange={(e) => handleInputFields(e, "password")}
                value={auth.password}
              />
              <FontAwesomeIcon
                icon={faEye}
                onClick={() =>
                  setAuth((p) => ({ ...p, showPass: !p.showPass }))
                }
                style={{ cursor: "pointer" }}
              />
            </div>
          </>
        ) : (
          <>
            <input
              type="text"
              autoFocus
              placeholder="Enter Username"
              onChange={(e) => handleInputFields(e, "username")}
              value={auth.username}
            />
            <input
              type="text"
              placeholder="Enter Email address"
              onChange={(e) => handleInputFields(e, "email")}
              value={auth.email}
            />
            <input
              type="number"
              placeholder="Enter Mobile number"
              onChange={(e) => handleInputFields(e, "phone")}
              value={auth.phone}
            />
            <input
              type="text"
              placeholder="Enter Your address"
              onChange={(e) => handleInputFields(e, "address")}
              value={auth.address}
            />
            <input
              type="text"
              placeholder="Your Favorite Sport?"
              onChange={(e) => handleInputFields(e, "answer")}
              value={auth.answer}
            />
            <div style={{ display: "flex" }}>
              <input
                type={`${auth.showPass ? "text" : "password"}`}
                placeholder="Enter Password"
                onChange={(e) => handleInputFields(e, "password")}
                value={auth.password}
              />
              <FontAwesomeIcon
                icon={faEye}
                onClick={() =>
                  setAuth((p) => ({ ...p, showPass: !p.showPass }))
                }
                style={{ cursor: "pointer" }}
              />
            </div>
          </>
        )}
        <div>
          <div className={styles.terms}>
            By continuing, you agree to Flipkart's{" "}
            <span className={styles.term_link}>Terms of Use</span> and{" "}
            <span className={styles.term_link}>Privacy Policy</span>.
          </div>
          <button type="submit" className={styles.cta_button}>
            {path === "login" ? "Login" : "Sign Up"}
          </button>
          {path === "login" ? (
            <Link to="/sign-up" className={styles.sign_up}>
              New to ShopHub? Create an account
            </Link>
          ) : (
            <Link to="/login" className={styles.log_in}>
              Existing User? Log in
            </Link>
          )}
        </div>
      </form>
    </div>
  );
};

export default Auth;
