import React, { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    oggetto: "",
    messaggio: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mailtoLink = `mailto:sclab96@gmail.com?subject=${encodeURIComponent(
      formData.oggetto
    )}&body=${encodeURIComponent(
      `Nome: ${formData.nome}\nEmail: ${formData.email}\n\nMessaggio:\n${formData.messaggio}`
    )}`;

    window.location.href = mailtoLink;

    setStatus("Messaggio pronto per essere inviato tramite la tua app di posta.");
    setFormData({ nome: "", email: "", oggetto: "", messaggio: "" });
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="nome"
        placeholder="Nome"
        value={formData.nome}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="oggetto"
        placeholder="Oggetto"
        value={formData.oggetto}
        onChange={handleChange}
        required
      />
      <textarea
        name="messaggio"
        placeholder="Messaggio"
        value={formData.messaggio}
        onChange={handleChange}
        required
      />
      <button type="submit" className="btn-book">
        Invia
      </button>
      {status && <p className="status-message">{status}</p>}
    </form>
  );
}
