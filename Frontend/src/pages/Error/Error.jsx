import { Link } from "react-router-dom";
import error from "../../assets/error.png";
import styles from "./Error.module.css";

const Error = () => {
  return (
    <div className={styles.cnt}>
      <img src={error} alt="error-404" width={450} height={324} />
      <div className={styles.txt}>
        Unfortunately the page you are looking for has been moved or deleted
      </div>
      <Link to="/" className={styles.home_btn}>
        GO TO HOMEPAGE
      </Link>
    </div>
  );
};

export default Error;
