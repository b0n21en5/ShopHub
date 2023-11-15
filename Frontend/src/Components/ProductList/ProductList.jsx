import axios from "axios";
import styles from "./ProductList.module.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);

  const fetchProductsByCategory = async () => {
    let limit = 6;
    if (window.innerWidth <= 412) {
      limit = 4;
    }

    const { data } = await axios.get(
      `/api/products/get-by-category/${
        category._id
      }?currPage=${1}&pageLimit=${limit}`
    );

    setProducts(data);
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, [category]);

  return (
    <>
      {products.length ? (
        <div className={styles.prdt_cnt}>
          {products.map((prdt) => (
            <Link to={`/${category.slug}/${prdt._id}`} key={prdt._id}>
              <div className={styles.prdt}>
                <div className={styles.prdt_img_cnt}>
                  <img
                    width="150"
                    height="190"
                    src={`/api/products/photo/${prdt._id}`}
                    alt={prdt.name}
                  />
                </div>
                <div className={styles.prdt_name} key={prdt._id}>
                  {prdt.name.length > 16
                    ? prdt.name.substr(0, 15) + "..."
                    : prdt.name}
                </div>
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
