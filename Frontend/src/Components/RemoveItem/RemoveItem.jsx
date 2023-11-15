import ReactDOM from "react-dom";
import styles from "./RemoveItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const RemoveItem = ({ setShowRemoveModal, removeFromCart, productId }) => {
  return ReactDOM.createPortal(
    <div
      className={styles.remove_item_modal_overlay}
      onClick={() => setShowRemoveModal(false)}
    >
      <div
        className={styles.remove_item_modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.heading}>Remove Item</div>
        <span>Are you sure you want to remove this item?</span>

        <div className={styles.buttons}>
          <div
            className={`${styles.btn} ${styles.cancel_btn}`}
            onClick={() => setShowRemoveModal(false)}
          >
            CANCEL
          </div>
          <div
            className={`${styles.btn} ${styles.remove_btn}`}
            onClick={() => removeFromCart(productId)}
          >
            REMOVE
          </div>
        </div>
      </div>
      <FontAwesomeIcon
        icon={faXmark}
        onClick={() => setShowRemoveModal(false)}
      />
    </div>,
    document.getElementById("modal-root")
  );
};

export default RemoveItem;
