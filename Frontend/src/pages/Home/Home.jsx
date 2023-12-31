import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import ProductList from "../../Components/ProductList/ProductList";
import toast from "react-hot-toast";
import { allCatsRoute, catPhotoRoute } from "../../constants/constants";
import styles from "./Home.module.css";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [dropdown, setDropdown] = useState(faAngleDown);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(allCatsRoute);
      setCategories(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    document.body.classList.add("homepage");
    getAllCategories();

    return () => {
      document.body.classList.remove("homepage");
    };
  }, []);

  return (
    <div className={styles.home}>
      <div className={styles.cat_cnt}>
        {categories?.map((c) => (
          <Link to={`/${c.slug}`} key={c._id}>
            <div className={styles.cat}>
              <div className={styles.cat_img_cnt}>
                <img
                  width="64"
                  height="64"
                  src={`${catPhotoRoute}/${c._id}`}
                  alt={`${c.name}-image`}
                />
              </div>
              <div
                className={styles.cat_name}
                key={c._id}
                onMouseEnter={() => setDropdown(faAngleUp)}
                onMouseLeave={() => setDropdown(faAngleDown)}
              >
                {c.name}
                {c.subcategories?.length ? (
                  <FontAwesomeIcon
                    icon={dropdown}
                    style={{ marginRight: "5px" }}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {categories.map((category) => (
        <ProductList category={category} key={category._id} />
      ))}
    </div>
  );
};

export default Home;
