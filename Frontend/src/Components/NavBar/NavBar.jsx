import {
  faBars,
  faCartShopping,
  faMagnifyingGlass,
  faStore,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchModal from "../SearchModal/SearchModal";
import UserMenu from "../UserMenu/UserMenu";
import axios from "axios";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isVisible, setIsVisible] = useState({ search: false, menu: false });
  const [scrollPos, setScrollPos] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("scroll-up");

  const { user } = useSelector((state) => state.user);

  const path = useLocation().pathname.substring(1);

  const navigate = useNavigate();

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;

    if (currentScrollPos > 0 && currentScrollPos > scrollPos) {
      setScrollDirection("scroll-down");
    } else {
      setScrollDirection("scroll-up");
    }

    setScrollPos(currentScrollPos);
  };

  useEffect(() => {
    if (window.innerWidth <= 412) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPos]);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/get-all");
      setCategories(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (path !== "" && path !== "cart") {
      getAllCategories();
    } else {
      setCategories([]);
    }
  }, [path]);

  useEffect(() => {
    if (localStorage.getItem("cart")) {
      const cartItem = JSON.parse(localStorage.getItem("cart"));
      setCartCount(cartItem.length);
    }
  }, [cartCount]);

  return !path.startsWith("admin") ? (
    <>
      <div
        className={`${styles.navbar} ${path !== "" ? styles.dodg_blue : ""} ${
          scrollDirection === "scroll-down"
            ? styles.navbar_hidden
            : styles.navbar_visible
        }`}
        onMouseEnter={() => setIsVisible({ ...isVisible, menu: false })}
      >
        {/* Nav Menu for Mobile  */}
        <div className={styles.mb_nav_menu}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => setIsVisible({ ...isVisible, menu: true })}
            />
            <Link to="/">
              <img height="28" width="100" src={logo} alt="logo" />
            </Link>
          </div>

          <div className={styles.mb_nav_right}>
            <Link to="/cart" className={styles.mb_cart_box} aria-label="cart-page-link">
              <div>
                {cartCount ? (
                  <span className={styles.mb_cart_count}>{cartCount}</span>
                ) : (
                  ""
                )}
                <FontAwesomeIcon icon={faCartShopping} />
              </div>
            </Link>

            <Link to="/account/profile">
              {user ? (
                <FontAwesomeIcon className={styles.mb_user} icon={faUser} />
              ) : (
                "Login"
              )}
            </Link>
          </div>
        </div>

        {/* Desktop Nav Menu */}
        <Link to="/" className={styles.logo_cnt}>
          <img height="40" width="150" src={logo} alt="logo" />
        </Link>

        {/* Search bar section */}
        <div className={styles.search_bar}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            placeholder="Search for Products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setIsVisible((prev) => ({ ...prev, search: true }))}
          />
        </div>
        {/* Search Modal will be visible on click search bar */}
        {isVisible.search && (
          <SearchModal searchTerm={searchTerm} setIsVisible={setIsVisible} />
        )}

        {/* Seller button */}
        <Link to="/admin" target="_blank" className={styles.seller}>
          {path === "" && <FontAwesomeIcon icon={faStore} />}
          <span> Become a Seller</span>
        </Link>

        {/* Sign-in button/ User info */}
        <div
          className={`${styles.sign_in_cnt} ${user ? styles.user_clr : ""}`}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setIsVisible({ ...isVisible, menu: true });
          }}
          onClick={() => {
            if (!user) navigate("/login");
            setIsVisible({ ...isVisible, menu: !isVisible.menu });
          }}
        >
          {path == "" ? (
            <>
              <FontAwesomeIcon className={styles.user} icon={faUser} />
              <span>{user ? user.username : "Sign in"}</span>
              <FontAwesomeIcon
                className={styles.angle}
                icon={isVisible.menu ? faAngleUp : faAngleDown}
              />
            </>
          ) : (
            <>
              {user ? (
                <>
                  <span>{user?.username}</span>
                  <FontAwesomeIcon
                    className={styles.angle}
                    icon={isVisible.menu ? faAngleUp : faAngleDown}
                  />
                </>
              ) : (
                "Login"
              )}
            </>
          )}
        </div>

        {/* user menu modal visible on hover sign-in button */}
        {isVisible.menu && (
          <UserMenu
            onMouseEnter={() => setIsVisible({ ...isVisible, menu: true })}
            onMouseLeave={() => setIsVisible({ ...isVisible, menu: false })}
          />
        )}

        {/* Cart button */}
        {path !== "cart" && (
          <Link to="/cart" className={styles.cart_box} aria-label="cart-page-link">
            <div>
              {cartCount ? (
                <span className={styles.cart_count}>{cartCount}</span>
              ) : (
                ""
              )}
              <FontAwesomeIcon icon={faCartShopping} />
            </div>
            <span className={styles.cart_name}>Cart</span>
          </Link>
        )}
      </div>

      {/* Categories list will show everywhere exept homepage */}
      {categories.length !== 0 ? (
        <div className={styles.category_cnt}>
          {categories.map((cat) => (
            <Link to={`/${cat.slug}`} key={cat._id} aria-label={`${cat.name} category link`}>
              {cat.name}
            </Link>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  ) : (
    ""
  );
};

export default NavBar;
