import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./ManageItem.module.css";

const ManageItem = () => {
  const [categories, setCategories] = useState([]);
  const [postData, setPostData] = useState({
    name: "",
    photo: "",
    desc: "",
    quantity: "",
    price: "",
    category: "",
    subCategory: "",
    rating: "",
    discount: "",
    delivery: "",
    brand: "",
  });

  const { slug, links, id } = useParams();

  const navigate = useNavigate();

  const fetchSingleData = async () => {
    try {
      const { data } = await axios.get(`/api/${links}/get-single/${id}`);
      setPostData({
        name: data.name,
        photo: "",
        desc: data.desc,
        quantity: data.quantity,
        price: data.price,
        category: data.category,
        subCategory: data.subcategory,
        rating: data.rating,
        discount: data.discount,
        delivery: data.delivery,
        brand: data.brand,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/get-all");
      setCategories(data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (links && id) {
      fetchSingleData();
    }
    fetchAllCategories();
  }, []);

  const addNewData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", postData.name);
      formData.append("photo", postData.photo);
      formData.append("desc", postData.desc);
      formData.append("quantity", postData.quantity);
      formData.append("price", postData.price);
      formData.append("category", postData.category);
      formData.append("subcategory", postData.subCategory);
      formData.append("rating", postData.rating);
      formData.append("discount", postData.discount);
      formData.append("delivery", postData.delivery);
      formData.append("brand", postData.brand);

      const { data } = await axios.post(`/api/${slug}/add-new`, formData);
      toast.success(data.message);
      navigate(`/admin/${slug}`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const updateProductCategoryData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", postData.name);
      if (postData.photo instanceof File) {
        formData.append("photo", postData.photo);
      }
      formData.append("desc", postData.desc);
      formData.append("quantity", postData.quantity);
      formData.append("price", postData.price);
      formData.append("category", postData.category);
      formData.append("subcategory", postData.subCategory);
      formData.append("rating", postData.rating);
      formData.append("discount", postData.discount);
      formData.append("delivery", postData.delivery);
      formData.append("brand", postData.brand);
      const { data } = await axios.put(`/api/${links}/update/${id}`, formData);
      toast.success(data.message);
      navigate(`/admin/${links}`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleFormPost = async (e) => {
    e.preventDefault();
    if (slug) {
      addNewData();
    } else if (links) {
      updateProductCategoryData();
    }
  };

  const handleDeleteProductCategory = async () => {
    try {
      const { data } = await axios.delete(`/api/${links}/delete/${id}`);
      toast.success(data.message);
      navigate(`/admin/${links}`);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleInputFields = (e, field) => {
    if (field === "photo") {
      setPostData((p) => ({ ...p, [field]: e.target.files[0] }));
    } else {
      setPostData((p) => ({ ...p, [field]: e.target.value }));
    }
  };

  return (
    <div className={styles.main}>
      <div className={`${styles.cnt} ${links ? styles.bg_white : ""}`}>
        {links && (
          <img
            src={`/api/${links}/photo/${id}`}
            alt="product/category image"
            width={200}
            height={200}
          />
        )}
        <form
          className={`${styles.post_form} ${links ? styles.bg_trans : ""}`}
          onSubmit={handleFormPost}
        >
          <input
            type="text"
            placeholder={`Enter ${slug} name`}
            onChange={(e) => handleInputFields(e, "name")}
            value={postData.name}
            autoFocus
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleInputFields(e, "photo")}
            required={slug}
          />

          {/* Input fields only for products */}
          {(slug === "products" || links === "products") && (
            <>
              <select
                onChange={(e) => handleInputFields(e, "category")}
                required={slug}
                // disabled={links}
              >
                <option value="" disabled selected={slug}>
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                    selected={links && cat._id === postData.category}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Enter sub category"
                onChange={(e) => handleInputFields(e, "subCategory")}
                value={postData.subCategory}
              />
              <input
                type="text"
                placeholder="Enter product specification"
                onChange={(e) => handleInputFields(e, "desc")}
                value={postData.desc}
              />
              <input
                type="text"
                placeholder="Enter product brand"
                onChange={(e) => handleInputFields(e, "brand")}
                value={postData.brand}
                required
              />
              <input
                type="number"
                placeholder="Price of the product"
                onChange={(e) => handleInputFields(e, "price")}
                value={postData.price}
                required
              />
              <input
                type="number"
                placeholder="Discount rate"
                onChange={(e) => handleInputFields(e, "discount")}
                value={postData.discount}
                required
              />
              <input
                type="number"
                placeholder="Product rating"
                onChange={(e) => handleInputFields(e, "rating")}
                value={postData.rating}
                required
              />
              <input
                type="number"
                placeholder="Delivery time in days"
                onChange={(e) => handleInputFields(e, "delivery")}
                value={postData.delivery}
                required
              />
              <input
                type="number"
                placeholder="Enter product quantity"
                onChange={(e) => handleInputFields(e, "quantity")}
                value={postData.quantity}
                required
              />
            </>
          )}

          <div className={styles.btn_cnt}>
            <button
              className={`${styles.btn} ${styles.submit_btn}`}
              type="submit"
            >
              {slug ? "Submit" : "Update"}
            </button>
            {links && (
              <button
                className={`${styles.btn} ${styles.delete_btn}`}
                onClick={handleDeleteProductCategory}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageItem;
