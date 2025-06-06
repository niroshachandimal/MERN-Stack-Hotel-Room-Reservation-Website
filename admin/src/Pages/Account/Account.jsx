// src/pages/Account.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChangePasswordForm from "../../component/Account/ChangePasswordForm";
import DeleteAccountForm from "../../component/Account/DeleteAccountForm";
import "../../component/Account/Account.scss";
import { Helmet } from "react-helmet";

const Account = ({ userType }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("password");

  // 🔁 If user logs out manually or gets cleared, redirect
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="account-container">
      <Helmet>
        <title>Account</title>
      </Helmet>
      <aside className="account-sidebar">
        <h2>My Account</h2>
        <ul>
          <li
            className={activeTab === "password" ? "active" : ""}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </li>
          <li
            className={activeTab === "delete" ? "active" : ""}
            onClick={() => setActiveTab("delete")}
          >
            Delete Account
          </li>
        </ul>
      </aside>

      <div className="account-content">
        {activeTab === "password" && (
          <ChangePasswordForm user={user} userType={userType} />
        )}
        {activeTab === "delete" && (
          <DeleteAccountForm user={user} userType={userType} />
        )}
      </div>
    </div>
  );
};

export default Account;
