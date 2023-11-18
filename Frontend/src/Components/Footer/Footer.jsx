import { Link, useLocation } from "react-router-dom";
import card from "../../assets/card.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import styles from "./Footer.module.css";

const Footer = () => {
  const path = useLocation().pathname;

  return (
    <div className={styles.cnt}>
      <div className={styles.top}>
        <div className={styles.sec}>
          <div className={styles.heading}>SOCIAL</div>
          <Link target="_blank" to="https://github.com/b0n21en5">Github</Link>
          <Link target="_blank" to="https://www.linkedin.com/in/bikash-nath/">LinkedIn</Link>
          <Link target="_blank" to="https://twitter.com/b0n21en5">Twitter</Link>
        </div>
      </div>

      <div className={styles.bottom}>
        {window.innerWidth > 420 && (
          <Link to="/admin" className={styles.seller}>
            <FontAwesomeIcon icon={faStore} />
            <span>Become a seller</span>
          </Link>
        )}
        <div>© 2023 ShopHub, Bikash Nath</div>
        <img src={card} alt="card" height={18} width={377} />
      </div>
    </div>
  );
};

export default Footer;
