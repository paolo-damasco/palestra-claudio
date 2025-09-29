import React, { useState, useEffect  } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

// Blocca scroll quando il menu è aperto
  useEffect(() => {
    if(menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [menuOpen]);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src="/images/sc.png" alt="Logo Palestra" />
        </Link>
      </div>

      {/* Desktop links */}
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/booking">Prenota</Link>
        <Link to="/about">Chi sono</Link>
        <Link to="/contact">Contattami</Link>
      </div>

      {/* Hamburger */}
      <div className="hamburger" onClick={toggleMenu}>
  <span className={`line ${menuOpen ? "open top" : ""}`} />
  <span className={`line ${menuOpen ? "open middle" : ""}`} />
  <span className={`line ${menuOpen ? "open bottom" : ""}`} />
</div>

      {/* Mobile menu fullscreen */}
      <div className={`navbar-links-mobile ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/booking" onClick={() => setMenuOpen(false)}>Prenotazioni</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>Chi sono</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contattami</Link>
	<span className="close-menu" onClick={() => setMenuOpen(false)}>×</span>
      </div>
    </nav>
  );
}

export default Navbar;
