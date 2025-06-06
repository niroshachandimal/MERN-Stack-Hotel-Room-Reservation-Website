
import "./ClientDashboard.scss";

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <h2>My Dashboard</h2><br></br>
      <ul className="menu">
        <li
          className={activeTab === "details" ? "active" : ""}
          onClick={() => setActiveTab("details")}
        >
          Booking Details
        </li>
        <li
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Booking History
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
