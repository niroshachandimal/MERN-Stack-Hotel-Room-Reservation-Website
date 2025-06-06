import "./styles/app.styles.scss"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Rooms from "./Pages/Rooms/Rooms";
import Room from "./Pages/Room/Room";
import Header from "./component/Header/Header";
import Booking from "./Pages/Booking/Booking";
import Success from "./Pages/Success/Success";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import ClientDashboard from "./Pages/ClientDashboard/ClientDashboard";
import CancelSuccess from "./Pages/CancelSuccess/CancelSuccess";
import Account from "./Pages/Account/Account";
import Footer from "./component/Footer/Footer";
import Spa from "./Pages/Spa/Spa";
import ScrollToTop from "./utils/ScrollToTop"; 



const App = () => {
  return <div>
      <Router>
         <ScrollToTop />
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/rooms" element={<Rooms/>}/>
          <Route path="/rooms/all/:id" element={<Room/>}/>
           <Route path="/bookings/:id" element={<Booking/>}/>  
           <Route path="/success" element={<Success/>}/>
           <Route path="/register" element={<Register />} />
           <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/cancel-success" element={<CancelSuccess />} />
            <Route path="/account" element={<Account userType="client" />} />
            <Route path="/spa" element={<Spa />} />


        </Routes>
        <Footer />
      </Router>
  </div>;
};

export default App;
