import ReactDOM from "react-dom";
import styles from "./UserMenu.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCartShopping,
  faPowerOff,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../../store/userSlice";

const UserMenu = ({ onMouseEnter, onMouseLeave }) => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  return ReactDOM.createPortal(
    <div className={styles.user_menu_overlay} onMouseEnter={onMouseLeave}>
      <div
        className={styles.user_menu}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {!user && (
          <div
            to={`/`}
            className={`${styles.menu_item} ${styles.mb_dis_non}`}
            onClick={onMouseLeave}
          >
            New customer?<Link to="/sign-up">Sign Up</Link>
          </div>
        )}
        <Link
          to="/account/profile"
          className={styles.mb_username}
          onClick={onMouseLeave}
        >
          <FontAwesomeIcon className="user" icon={faUser} />
          {user ? user.username : "Login & Signup"}
        </Link>
        <Link
          to={`/account/profile`}
          className={styles.menu_item}
          onClick={onMouseLeave}
        >
          <FontAwesomeIcon className="user" icon={faUser} />
          My Profile
        </Link>
        <Link
          to={`/account/orders`}
          className={styles.menu_item}
          onClick={onMouseLeave}
        >
          <FontAwesomeIcon className="user" icon={faBox} />
          Orders
        </Link>
        <Link
          to={`/cart`}
          className={`${styles.menu_item} ${styles.mb_menu_item}`}
          onClick={onMouseLeave}
        >
          <FontAwesomeIcon className="user" icon={faCartShopping} />
          My Cart
        </Link>
        {user && (
          <div
            className={styles.menu_item}
            onClick={() => dispatch(removeUser())}
          >
            <FontAwesomeIcon icon={faPowerOff} />
            Logout
          </div>
        )}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default UserMenu;
