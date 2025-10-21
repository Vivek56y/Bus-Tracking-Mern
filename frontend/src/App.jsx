import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import BusMapPreview from "./components/BusMapPreview";
import Contact from "./components/Contact";
import BusList from "./components/BusList";
import Addbuses from "./pages/Addbuses";
import AddBusForm from "./components/AddBusForm";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Addbuses" element={<Addbuses />} />
          <Route path="/BusMapPreview" element={<BusMapPreview />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/AddBusForm" element={<AddBusForm />} />
          <Route path="/BusList" element={<BusList />}/>
          <Route path="/Login" element={<LoginPage/>}/>
           <Route path="/signup" element={<SignupPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
