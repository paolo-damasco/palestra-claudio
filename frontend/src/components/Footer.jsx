import React from "react";

// Icone importate da react-icons
import { FaInstagram, FaFacebook } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Contatto principale */}
        

        {/* Social link palestra */}
        <div className="social-links">
          <a
            href="https://www.instagram.com/damascocla1/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram style={{ marginRight: "0.3rem" }} /> Instagram
          </a>
          <a
            href="https://www.facebook.com/claudio.damasco.7"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook style={{ marginRight: "0.3rem" }} /> Facebook
          </a>
        </div>

        {/* Contatto sviluppatore */}
        <p className="credits">
          Sito a cura di Paolo Damasco | {" "}
          <a
            href="https://www.instagram.com/paolo_damasco22/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram style={{ marginRight: "0.3rem" }} /> @paolo_damasco22
          </a>
          <br />
          Tecnologie utilizzate: React, Vite, TailwindCSS
        </p>
      </div>
    </footer>
  );
}

export default Footer;
