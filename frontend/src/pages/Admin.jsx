import { useState, useEffect } from "react";

// Costanti
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const italianHolidays = [
  "01-01","06-01","25-04","01-05","02-06",
  "15-08","01-11","08-12","25-12","26-12"
];
const slots = ["17:00", "18:00", "19:00", "20:00"];

const isDayDisabled = (date) => {
  const day = date.getDay();
  const monthDay =
    ("0" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date.getDate()).slice(-2);
  return day === 0 || day === 6 || italianHolidays.includes(monthDay);
};

const getAvailableDates = (bookings = []) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    if (!isDayDisabled(d)) {
      const yyyy = d.getFullYear();
      const mm = ("0" + (d.getMonth() + 1)).slice(-2);
      const dd = ("0" + d.getDate()).slice(-2);
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const count = bookings.filter(b => b.data === dateStr).length;
      if (count < slots.length) dates.push(dateStr);
    }
  }
  return dates;
};

export default function Admin() {

useEffect(() => {
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "/manifest-admin.json"; // punta al manifest admin
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [unpaid, setUnpaid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [newBooking, setNewBooking] = useState({
    nome: "", email: "", data: "", orario: slots[0], pagato: 0
  });
  const [tempEdit, setTempEdit] = useState({});
  const [activeCardId, setActiveCardId] = useState(null);

  const headers = { "x-admin-password": ADMIN_PASSWORD };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchUnpaid();
    }
  }, [isAuthenticated]);

  const fetchBookings = () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/bookings`, { headers })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(data => { setBookings(data); setLoading(false); })
  .catch(err => { console.error("Errore fetch bookings:", err); setLoading(false); });

  };

  const fetchUnpaid = () => {
    fetch(`${BACKEND_URL}/api/bookings/unpaid`, { headers })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(data => setUnpaid(data))
  .catch(err => console.error("Errore fetch unpaid:", err));

  };

  const handleLogin = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordInput })
    });
    const data = await res.json();
    if(data.success) setIsAuthenticated(true);
    else setMessage("Password errata!");
  } catch(err) {
    console.error(err);
    setMessage("Errore di connessione al server");
  }
};


  const handleDelete = (id) => {
    fetch(`${BACKEND_URL}/api/bookings/${id}`, { method: "DELETE", headers })
      .then(res => res.json())
      .then(() => { fetchBookings(); fetchUnpaid(); })
      .catch(err => console.error(err));
  };

  const handleUpdate = (id, fields) => {
    fetch(`${BACKEND_URL}/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(fields)
    })
      .then(res => res.json())
      .then(() => { fetchBookings(); fetchUnpaid(); })
      .catch(err => console.error(err));
  };

  const handleAddBooking = () => {
    if (!newBooking.nome || !newBooking.email || !newBooking.data || !newBooking.orario) {
      alert("Compila tutti i campi");
      return;
    }
    if (bookings.some(b => b.data === newBooking.data && b.orario === newBooking.orario)) {
      alert("Orario già occupato");
      return;
    }
    fetch(`${BACKEND_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": ADMIN_PASSWORD },
  body: JSON.stringify(newBooking)
    })
      .then(res => res.json())
      .then(() => {
        fetchBookings();
        fetchUnpaid();
        setNewBooking({ nome: "", email: "", data: "", orario: slots[0], pagato: 0 });
      })
      .catch(err => console.error(err));
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <h2>Accesso Admin</h2>
        <input
          type="password"
          placeholder="Inserisci la password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button className="calendar-slot" onClick={handleLogin}>Accedi</button>
        {message && <div style={{ color: "red", marginTop: "10px" }}>{message}</div>}
      </div>
    );
  }

  if (loading) {
    return <div className="skeleton" style={{ height: "200px" }}></div>;
  }

  const availableDates = getAvailableDates(bookings);

  // Ordina le prenotazioni per data + orario (dal più vicino al più lontano)
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateTimeA = new Date(`${a.data}T${a.orario}`);
    const dateTimeB = new Date(`${b.data}T${b.orario}`);
    return dateTimeA - dateTimeB;
  });

// Ordina i pagamenti non pagati in ordine cronologico
  const sortedUnpaid = [...unpaid].sort((a, b) => {
    const dateTimeA = new Date(`${a.data}T${a.orario}`);
    const dateTimeB = new Date(`${b.data}T${b.orario}`);
    return dateTimeA - dateTimeB;
  });

  return (
    <div className="admin-page">
      <h2>Aggiungi prenotazione</h2>

      {/* Aggiungi prenotazione */}
      <div className="add-booking">
        <input type="text" className="admin-input" placeholder="Nome" value={newBooking.nome} onChange={e => setNewBooking({...newBooking, nome:e.target.value})} />
        <input type="email" className="admin-input" placeholder="Email" value={newBooking.email} onChange={e => setNewBooking({...newBooking, email:e.target.value})} />
        <select value={newBooking.data} onChange={e => setNewBooking({...newBooking, data:e.target.value})}>
          <option value="">Seleziona data</option>
          {availableDates.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={newBooking.orario} onChange={e => setNewBooking({...newBooking, orario:e.target.value})}>
          {slots.map(s => 
            <option key={s} value={s} disabled={bookings.some(b => b.data === newBooking.data && b.orario === s)}>
              {s}
            </option>
          )}
        </select>
       <label className="checkbox-label">
  Pagato
  <input
    type="checkbox"
    checked={newBooking.pagato === 1}
    onChange={e => setNewBooking({...newBooking, pagato: e.target.checked ? 1:0})}
  />
</label>



        <button className="btn-book" onClick={handleAddBooking}>Aggiungi</button>
      </div>

      {/* Tabella desktop e Card mobile */}
      <h2>Prenotazioni effettuate</h2>
      <div className="desktop-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Data</th>
              <th>Orario</th>
              <th>Pagato</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map(b => (
              <tr key={b.id}>
                <td>
                  <input type="text" className="admin-input" value={tempEdit[b.id]?.nome ?? b.nome}
                         onChange={e => setTempEdit({...tempEdit, [b.id]: {...tempEdit[b.id], nome:e.target.value}})} />
                </td>
                <td>
                  <input type="email" className="admin-input" value={tempEdit[b.id]?.email ?? b.email}
                         onChange={e => setTempEdit({...tempEdit, [b.id]: {...tempEdit[b.id], email:e.target.value}})} />
                </td>
                <td>
                  <select value={b.data} onChange={(e) => handleUpdate(b.id, {data:e.target.value})}>
                    {availableDates.map(date => <option key={date} value={date}>{date}</option>)}
                  </select>
                </td>
                <td>
                  <select value={b.orario} onChange={(e) => handleUpdate(b.id, {orario:e.target.value})}>
                    {slots.map(s => 
                      <option key={s} value={s} disabled={bookings.some(x => x.data === b.data && x.orario === s && x.id !== b.id)}>{s}</option>
                    )}
                  </select>
                </td>
                <td>
                  <input type="checkbox" checked={b.pagato === 1} onChange={e => handleUpdate(b.id, {pagato:e.target.checked ? 1:0})} />
                </td>
                <td className="action-buttons">
                  <button className="calendar-slot " onClick={() => handleUpdate(b.id, {
                    nome: tempEdit[b.id]?.nome ?? b.nome,
                    email: tempEdit[b.id]?.email ?? b.email
                  })}>Modifica</button>
                  <button className="delete" onClick={() => handleDelete(b.id)}>Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-cards">
        {sortedBookings.map(b => (
          <div
            key={b.id}
            className={`booking-card ${activeCardId === b.id ? 'active' : ''}`}
            onClick={() => setActiveCardId(activeCardId === b.id ? null : b.id)}
          >
            <strong>{b.nome}</strong> - {b.email} - {b.data} alle {b.orario}
            <div className="booking-details">
              <input type="text" className="admin-input" value={tempEdit[b.id]?.nome ?? b.nome}
                     onChange={e => setTempEdit({...tempEdit, [b.id]: {...tempEdit[b.id], nome:e.target.value}})} />
              <input type="email" className="admin-input" value={tempEdit[b.id]?.email ?? b.email}
                     onChange={e => setTempEdit({...tempEdit, [b.id]: {...tempEdit[b.id], email:e.target.value}})} />
              <select value={b.data} onChange={(e) => handleUpdate(b.id, {data:e.target.value})}>
                {availableDates.map(date => <option key={date} value={date}>{date}</option>)}
              </select>
              <select value={b.orario} onChange={(e) => handleUpdate(b.id, {orario:e.target.value})}>
                {slots.map(s => 
                  <option key={s} value={s} disabled={bookings.some(x => x.data === b.data && x.orario === s && x.id !== b.id)}>{s}</option>
                )}
              </select>
              <label className="checkbox-label">
                Pagato
                <input type="checkbox" checked={b.pagato === 1} onChange={e => handleUpdate(b.id, {pagato:e.target.checked ? 1:0})} />
              </label>

              <div className="admin-buttons">
                <button className="calendar-slot " onClick={() => handleUpdate(b.id, {
                  nome: tempEdit[b.id]?.nome ?? b.nome,
                  email: tempEdit[b.id]?.email ?? b.email
                })}>Modifica</button>
                <button className="delete" onClick={() => handleDelete(b.id)}>Elimina</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Da pagare */}
      <h2>Resoconto pagamenti</h2>
      <div style={{ marginTop: "20px" }}>
        {sortedUnpaid.length === 0 ? <p>Tutti hanno pagato!</p> :
          <ul>
            {sortedUnpaid.map(u => <li key={u.id}>{u.nome} - {u.email} - {u.data} alle {u.orario}</li>)}
          </ul>
        }
      </div>
    </div>
  );
}
