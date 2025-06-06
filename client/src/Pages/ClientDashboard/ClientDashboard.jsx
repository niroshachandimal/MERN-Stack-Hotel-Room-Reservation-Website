// ClientDashboard.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../component/ClientDashboard/Sidebar";
import BookingDetailsTable from "../../component/ClientDashboard/BookingDetailsTable";
import BookingHistoryTable from "../../component/ClientDashboard/BookingHistoryTable";
import { motion } from "framer-motion";
import "./clientDashboard.scss";
import { Helmet } from "react-helmet";

const ClientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <motion.div
        className="dashboard-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="dashboard-header">
          <h1>
            {activeTab === "details" ? "My Current Bookings" : "My Booking History"}
          </h1>
         
        </div>

        {activeTab === "details" && <BookingDetailsTable />}
        {activeTab === "history" && <BookingHistoryTable />}
      </motion.div>
    </motion.div>
  );
};

export default ClientDashboard;
