import React from "react";
import ContactForm from "../components/ContactForm";

function Contact() {
  return (
    <div className="contact-page fade-anim">
      <div className="contact-card">
        <div className="contact-header">
          <h1>Contattami</h1>
          <p>Hai domande o segnalazioni? Compila il modulo qui sotto.</p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}

export default Contact;
