import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  productByCatRoute,
  productPhotoRoute,
} from "../../constants/constants";
import toast from "react-hot-toast";
import styles from "./ProductList.module.css";

const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);

  const fetchProductsByCategory = async () => {
    let limit = 6;
    if (window.innerWidth <= 420) {
      limit = 4;
    }

    try {
      const { data } = await axios.get(
        `${productByCatRoute}/${category._id}?currPage=${1}&pageLimit=${limit}`
      );

      setProducts(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, [category]);

  return (
    <>
      {products.length ? (
        <div className={styles.prdt_cnt}>
          {products.map((prdt) => (
            <Link
              to={`/${category.slug}/${prdt._id}`}
              key={prdt._id}
              className={styles.prdt}
            >
              <div className={styles.prdt_img_cnt}>
                <img
                  src={`${productPhotoRoute}/${prdt._id}`}
                  alt={`${prdt.name}-image`}
                />
              </div>
              <div className={styles.prdt_name} key={prdt._id}>
                {prdt.name.length > 16
                  ? prdt.name.substr(0, 15) + "..."
                  : prdt.name}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ProductList;
