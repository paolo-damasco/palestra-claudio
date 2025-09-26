import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import SplashScreen from "./components/SplashScreen";
import Admin from "./pages/Admin";

function App() {
  const [loading, setLoading] = useState(false); // Loader API
  const [splashFinished, setSplashFinished] = useState(false); // Splash iniziale

  return (
    <Router>
      {!splashFinished && <SplashScreen onFinish={() => setSplashFinished(true)} />}

      <div className="app-container">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking setLoading={setLoading} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact setLoading={setLoading} />} />
	    <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>

      {/* Loader globale */}
      <Loader visible={loading} />
    </Router>
  );
}

export default App;
