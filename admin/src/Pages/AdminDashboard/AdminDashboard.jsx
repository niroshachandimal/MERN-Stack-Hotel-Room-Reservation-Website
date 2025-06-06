import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/AdminDashboard/Sidebar";
import ActiveBookingsTable from "../../component/AdminDashboard/ActiveBookingsTable";
import ConfirmationHistoryTable from "../../component/AdminDashboard/BookingHistoryTable";
import CancelledBookingsTable from "../../component/AdminDashboard/CancelledBookingsTable"
import OverviewChart from "../../component/AdminDashboard/Overview";
import "./adminDashboard.scss";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    if (!user || user.isAdmin !== true) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="dashboard-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-content">
        {activeTab === "active" && <ActiveBookingsTable />}
        {activeTab === "history" && <ConfirmationHistoryTable />}
        {activeTab === "cancelled" && <CancelledBookingsTable />}
        {activeTab === "overview" && <OverviewChart />}
      </div>
    </div>
  );
};

export default AdminDashboard;
