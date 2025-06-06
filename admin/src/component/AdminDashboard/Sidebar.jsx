import "./adminDashboard.scss";

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <h2>Admin Dashboard</h2>
      <ul className="menu">
        <li
          className={activeTab === "active" ? "active" : ""}
          onClick={() => setActiveTab("active")}
        >
          Active Bookings
        </li>
        <li
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Booking Confirmation History
        </li>
        <li
  className={activeTab === "cancelled" ? "active" : ""}
  onClick={() => setActiveTab("cancelled")}
>
  Booking Cancellation History
</li>


        <li
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
