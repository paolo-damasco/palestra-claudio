import { useState, useEffect } from "react";
import BookingCalendar from "../components/BookingCalendar.jsx";
import Loader from "../components/Loader.jsx";

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/bookings`)
      .then(res => res.json())
      .then(data => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setBookings([]);
        setLoading(false);
      });
  }, []);

  const handleBookingSubmit = ({ nome, email, orario, data, sendClientMail }) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const selectedDate = new Date(data); 
    selectedDate.setHours(0,0,0,0);
    if (selectedDate < today) { 
      setMessage("Non puoi prenotare in una data passata!"); 
      return; 
    }

    setLoading(true);

    fetch(`${BACKEND_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, orario, data, sendClientMail })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setBookings([...bookings, data.booking]);
        setFeedback("Prenotazione effettuata ✅");
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 3000);
      } else {
        setMessage(data.message || "Errore durante la prenotazione.");
      }
    })
    .catch(err => { 
      console.error(err); 
      setMessage("Errore durante la prenotazione."); 
    })
    .finally(() => setLoading(false));
  };

  return (
    <div 
      className="fade-anim" 
      style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {message && <div style={{ marginBottom: "20px", color: "#fff" }}>{message}</div>}

      <BookingCalendar 
        bookings={bookings} 
        onBookingSubmit={handleBookingSubmit}
        feedback={feedback}         
        showFeedback={showFeedback} 
      />

      <Loader visible={loading} />
    </div>
  );
}
