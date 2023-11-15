import { useDispatch } from "react-redux";
import styles from "./ProfileInputField.module.css";
import { updateUser } from "../../store/userSlice";

const ProfileInputField = ({ heading, field, setField,updateUserCredentials }) => {
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setField((prev) => ({ ...prev, value: e.target.value }));
  };

  const handleSaveButton = () => {
    dispatch(updateUser({ [field.name]: field.value }));
    setField((prev) => ({ ...prev, edit: !prev.edit }));
    updateUserCredentials()
  };

  return (
    <div>
      <div className={styles.input_heading}>
        {heading}
        <div
          className={styles.edit_btn}
          onClick={() => setField((p) => ({ ...p, edit: !p.edit }))}
        >
          {field.edit ? "Cancel" : "Edit"}
        </div>
      </div>
      <div
        className={`${styles.input_cnt} ${
          field.edit ? "" : styles.edit_disable
        }`}
      >
        <input
          type="text"
          value={field.value}
          placeholder="Edit User name"
          onChange={handleInputChange}
          disabled={!field.edit}
        />
        {field.edit && (
          <div className={styles.save_btn} onClick={handleSaveButton}>
            SAVE
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInputField;
