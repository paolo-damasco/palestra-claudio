import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { it } from "date-fns/locale";

registerLocale("it", it);

// Festività italiane
const italianHolidays = [
  "01-01", "06-01", "25-04", "01-05", "02-06", "15-08",
  "01-11", "08-12", "25-12", "26-12"
];

// Funzione per disabilitare weekend e festività
const isDayDisabled = (date) => {
  const day = date.getDay();
  const monthDay = ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
  if (day === 0 || day === 6) return true;
  return italianHolidays.includes(monthDay);
};

export default function BookingCalendar({ bookings = [], onBookingSubmit }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [email, setEmail] = useState("");

  const slots = ["17:00", "18:00", "19:00", "20:00"];

  // Trova gli slot già prenotati per il giorno selezionato
  const bookedSlots = bookings
    .filter(b => selectedDate && new Date(b.data).toDateString() === selectedDate.toDateString())
    .map(b => b.orario);

  const handleSlotClick = (slot) => {
    if (!bookedSlots.includes(slot)) setSelectedSlot(slot);
  };

  const handleSubmit = () => {
    if (!email || !selectedDate || !selectedSlot) {
      alert("Inserisci email, data e orario!");
      return;
    }

    if (typeof onBookingSubmit === "function") {
      onBookingSubmit({
        nome: "Cliente", // opzionale
        email,
        data: selectedDate.toISOString(),
        orario: selectedSlot
      });

      setSelectedSlot("");
      setSelectedDate(null);
      setEmail("");
    } else {
      console.error("onBookingSubmit non è una funzione!");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <input
        type="email"
        placeholder="Inserisci la tua email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "250px"
        }}
      />

      <DatePicker
        selected={selectedDate}
        onChange={date => { setSelectedDate(date); setSelectedSlot(""); }}
        locale="it"
        dateFormat="dd/MM/yyyy"
        filterDate={date => !isDayDisabled(date)}
        inline
      />

      {selectedDate && (
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", justifyContent: "center" }}>
          {slots.map(slot => (
            <div
              key={slot}
              onClick={() => handleSlotClick(slot)}
              style={{
                padding: "12px 18px",
                borderRadius: "8px",
                cursor: bookedSlots.includes(slot) ? "not-allowed" : "pointer",
                backgroundColor: bookedSlots.includes(slot)
                  ? "#ef4444"
                  : selectedSlot === slot
                  ? "#3b82f6"
                  : "#10b981",
                color: "#fff",
                fontWeight: "600",
                transition: "all 0.25s ease-in-out",
                transform: bookedSlots.includes(slot) ? "none" : "scale(1)"
              }}
              onMouseEnter={e => {
                if (!bookedSlots.includes(slot)) e.currentTarget.style.transform = "scale(1.15)";
              }}
              onMouseLeave={e => {
                if (!bookedSlots.includes(slot)) e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {bookedSlots.includes(slot) ? "Occupato" : slot}
            </div>
          ))}
        </div>
      )}

      {selectedSlot && email && (
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "20px",
            padding: "14px 30px",
            backgroundColor: "#ff5c5c",
            color: "#fff",
            fontWeight: "600",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.25s ease-in-out",
            transform: "scale(1)"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.08)";
            e.currentTarget.style.backgroundColor = "#e04a4a"; // rosso più scuro
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = "#ff5c5c"; // colore originale
          }}
        >
          Prenota
        </button>
      )}
    </div>
  );
}
