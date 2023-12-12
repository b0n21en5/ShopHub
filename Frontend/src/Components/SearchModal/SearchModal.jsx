import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./SearchModal.module.css";
import {
  allCatsRoute,
  productPhotoRoute,
  searchProductsRoute,
} from "../../constants/constants";

const SearchModal = ({ setIsVisible, searchTerm }) => {
  const [searchData, setSearchData] = useState([]);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${allCatsRoute}`);
      setSearchData(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleSearchQuery = async () => {
    try {
      const { data } = await axios.get(`${searchProductsRoute}/${searchTerm}`);
      setSearchData(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearchQuery();
    } else {
      getAllCategories();
    }
  }, [searchTerm]);

  return ReactDOM.createPortal(
    <div
      className={styles.search_modal_overlay}
      onClick={() => setIsVisible((prev) => ({ ...prev, search: false }))}
    >
      <div className={styles.search_modal} onClick={(e) => e.stopPropagation()}>
        <h5>Discover more</h5>
        <div className={styles.result}>
          {searchData?.map((item) => (
            <Link
              to={`/${item.slug}/${item._id}`}
              key={item._id}
              onClick={() =>
                setIsVisible((prev) => ({ ...prev, search: false }))
              }
            >
              {item?.photo?.data ? (
                <img
                  width={40}
                  height={40}
                  src={`${productPhotoRoute}/${item._id}`}
                  alt={item.name}
                />
              ) : (
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              )}
              {item.name.substr(0, 52).toLowerCase() +
                `${item.name.length > 52 ? "..." : ""}`}
            </Link>
          ))}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default SearchModal;
