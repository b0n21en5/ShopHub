import { useDispatch, useSelector } from "react-redux";
import profile from "../../assets/profile.svg";
import profileBg from "../../assets/profile-bg.png";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faBoxOpen,
  faPowerOff,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { removeUser } from "../../store/userSlice";
import { useEffect, useState } from "react";
import ProfileInputField from "../../Components/ProfileInputField/ProfileInputField";
import styles from "./MyProfile.module.css";
import axios from "axios";
import toast from "react-hot-toast";

const MyProfile = () => {
  const [edit, setEdit] = useState("profile");
  const [username, setUsername] = useState({
    edit: false,
    value: "",
    name: "username",
  });
  const [email, setEmail] = useState({ edit: false, value: "", name: "email" });
  const [phone, setPhone] = useState({ edit: false, value: "", name: "phone" });
  const [address, setAddress] = useState({
    edit: false,
    value: "",
    name: "address",
  });

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const updateUserCredentials = async () => {
    try {
      const { data } = await axios.put("/api/auth/update-user", {
        username: username.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
      });
      if (data) {
        toast.success("Account Details Updated!");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (user) {
      setUsername((p) => ({ ...p, value: user.username }));
      setEmail((p) => ({ ...p, value: user.email }));
      setPhone((p) => ({ ...p, value: user.phone }));
      setAddress((p) => ({ ...p, value: user.address }));
    } else navigate("/login");
  }, [user]);

  return (
    <div className={styles.profile_cnt}>
      <div className={styles.profile_left}>
        {/* Title on left side */}
        <div className={`${styles.title} ${styles.bg_white_shdw}`}>
          <img src={profile} alt="profile" width={50} height={50} />
          <div>
            <div>Hello,</div>
            <div className={styles.user}>{user?.username}</div>
          </div>
        </div>

        {/* Profile setting options  */}
        <div className={`${styles.settings} ${styles.bg_white_shdw}`}>
          {/* My orders link */}
          <div className={`${styles.setting_sec} ${styles.link}`}>
            <Link
              to={`/account/orders`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className={styles.head}>
                <FontAwesomeIcon icon={faBoxOpen} />
                <div>MY ORDERS</div>
              </div>
              <FontAwesomeIcon
                icon={faAngleRight}
                color="grey"
                style={{ marginRight: "20px" }}
              />
            </Link>
          </div>

          {/* Account settings */}
          <div className={`${styles.setting_sec}`}>
            <div className={styles.head}>
              <FontAwesomeIcon icon={faUser} />
              <div>ACCOUNT SETTINGS</div>
            </div>
            <div
              className={`${styles.set} ${
                edit === "profile" ? styles.active : ""
              }`}
              onClick={() => setEdit("profile")}
            >
              Profile Information
            </div>
            <div
              className={`${styles.set} ${
                edit === "address" ? styles.active : ""
              }`}
              onClick={() => setEdit("address")}
            >
              Manage Addresses
            </div>
          </div>

          {/* Logout Button */}
          <div
            className={`${styles.setting_sec} ${styles.link}`}
            onClick={() => {
              dispatch(removeUser());
              navigate("/");
            }}
          >
            <div className={styles.head}>
              <FontAwesomeIcon icon={faPowerOff} />
              <div>Logout</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Personal Information */}
      <div className={`${styles.profile_right} ${styles.bg_white_shdw}`}>
        {edit === "profile" ? (
          <>
            <div className={styles.edit_details}>
              <ProfileInputField
                heading="Personal Information"
                field={username}
                setField={setUsername}
                updateUserCredentials={updateUserCredentials}
              />
              <ProfileInputField
                heading="Email Address"
                field={email}
                setField={setEmail}
                updateUserCredentials={updateUserCredentials}
              />
              <ProfileInputField
                heading="Mobile Number"
                field={phone}
                setField={setPhone}
                updateUserCredentials={updateUserCredentials}
              />
            </div>
            <img src={profileBg} alt="profile-background" />
          </>
        ) : (
          <div className={styles.edit_details}>
            <ProfileInputField
              heading="Manage Addresses"
              field={address}
              setField={setAddress}
              updateUserCredentials={updateUserCredentials}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
