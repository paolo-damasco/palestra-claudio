import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { it } from "date-fns/locale";

registerLocale("it", it);

const italianHolidays = [
  "01-01", "06-01", "25-04", "01-05", "02-06",
  "15-08", "01-11", "08-12", "25-12", "26-12"
];

const isDayDisabled = (date) => {
  const day = date.getDay();
  const monthDay =
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2);
  return day === 0 || day === 6 || italianHolidays.includes(monthDay);
};

const formatLocalDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = ("0" + (date.getMonth() + 1)).slice(-2);
  const dd = ("0" + date.getDate()).slice(-2);
  return `${yyyy}-${mm}-${dd}`;
};


export default function BookingCalendar({ bookings = [], onBookingSubmit, feedback, showFeedback }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [sendClientMail, setSendClientMail] = useState(true);

  const [localFeedback, setLocalFeedback] = useState("");
  const [localShowFeedback, setLocalShowFeedback] = useState(false);

  const slots = ["17:00", "18:00", "19:00", "20:00"];
  const today = new Date();

  const bookedSlots = bookings
    .filter((b) => selectedDate && b.data === formatLocalDate(selectedDate))
    .map((b) => b.orario);

  const handleSlotClick = (slot) => {
    if (!bookedSlots.includes(slot)) setSelectedSlot(slot);
  };

  const showFeedbackPopup = (message) => {
    setLocalFeedback(message);
    setLocalShowFeedback(true);
    setTimeout(() => setLocalShowFeedback(false), 3000);
  };

  const handleSubmit = () => {
    if (!nome || !email || !selectedDate || !selectedSlot) {
      showFeedbackPopup("Compila tutti i campi richiesti.");
      return;
    }

    const booking = {
      nome,
      email,
      data: formatLocalDate(selectedDate),
      orario: selectedSlot,
      sendClientMail,
    };

    if (onBookingSubmit) {
      onBookingSubmit(booking);
      // Reset campi
      setSelectedSlot("");
      setSelectedDate(null);
      setNome("");
      setEmail("");
      setSendClientMail(true);
    }
  };

  return (
    <div className="booking-container">
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Prenota il tuo allenamento
      </h2>

      {/* Campi Nome e Email */}
      <div className="booking-fields">
        <input
          type="text"
          placeholder="Inserisci il tuo nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="booking-input"
        />
        <input
          type="email"
          placeholder="Inserisci la tua email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="booking-input"
        />
      </div>

      {/* Checkbox */}
      <label className="checkbox-container">
        Voglio ricevere una mail di conferma
        <input
          type="checkbox"
          checked={sendClientMail}
          onChange={() => setSendClientMail(!sendClientMail)}
        />
        <span className="checkmark"></span>
      </label>

      {/* Calendario */}
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          setSelectedSlot("");
          setLocalFeedback("");
        }}
        locale="it"
        dateFormat="dd/MM/yyyy"
        filterDate={(date) => !isDayDisabled(date) && date >= today}
        inline
      />

      {/* Contenitore slot animato */}
      <div className={`calendar-container ${selectedDate ? "active" : ""}`}>
        {slots.map((slot, idx) => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              onClick={() => handleSlotClick(slot)}
              disabled={isBooked}
              className={`calendar-slot ${
                isBooked ? "occupied" : isSelected ? "calendar-selected" : ""
              }`}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {isBooked ? "Occupato" : slot}
            </button>
          );
        })}
      </div>

      {/* Bottone Prenota */}
      {selectedSlot && (
        <button className="btn-book fade-anim" onClick={handleSubmit}>
          Prenota
        </button>
      )}

      {/* ✅ Popup di feedback rosso (local) */}
      {localFeedback && (
        <div
          className={`feedback-popup error ${localShowFeedback ? "show" : ""}`}
        >
          {localFeedback}
        </div>
      )}

      {/* ✅ Popup verde (dal parent) */}
      {feedback && (
        <div
          className={`feedback-popup success ${showFeedback ? "show" : ""}`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}
