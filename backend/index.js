const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const nodemailer = require("nodemailer");
const ics = require("ics");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Database SQLite
const db = new sqlite3.Database("./bookings.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Database connesso.");
});

// Crea tabella se non esiste, aggiungendo campo pagato (0 = non pagato, 1 = pagato)
db.run(`CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  email TEXT,
  orario TEXT,
  data TEXT,
  pagato INTEGER DEFAULT 0
)`);

// Nodemailer config con App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// PASSWORD STATICO ADMIN
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Middleware autenticazione admin
function adminAuth(req, res, next) {
  const password = req.headers["x-admin-password"];
  if (password === ADMIN_PASSWORD) next();
  else res.status(403).json({ success: false, message: "Accesso negato" });
}

// GET tutte le prenotazioni
app.get("/api/bookings", (req, res) => {
  db.all("SELECT * FROM bookings", [], (err, rows) => {
    if (err) return res.json([]);
    res.json(rows);
  });
});

// GET prenotazioni non pagate (solo admin)
app.get("/api/bookings/unpaid", adminAuth, (req, res) => {
  db.all("SELECT * FROM bookings WHERE pagato=0", [], (err, rows) => {
    if (err) return res.json([]);
    res.json(rows);
  });
});

// POST nuova prenotazione
app.post("/api/bookings", (req, res) => {
  const { nome, email, orario, data, sendClientMail, pagato = 0 } = req.body;
  if (!nome || !email || !orario || !data)
    return res.json({ success: false, message: "Dati mancanti" });

  const dateStr = data;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = dateStr.split("-").map(Number);
  const selectedDate = new Date(y, m - 1, d);
  if (selectedDate < today)
    return res.json({ success: false, message: "Data nel passato" });

  db.get("SELECT * FROM bookings WHERE orario=? AND data=?", [orario, dateStr], (err, row) => {
    if (err) return res.json({ success: false, message: err.message });
    if (row) return res.json({ success: false, message: "Slot già prenotato" });

    db.run(
      "INSERT INTO bookings (nome,email,orario,data,pagato) VALUES (?,?,?,?,?)",
      [nome, email, orario, dateStr, pagato],
      function (err) {
        if (err) return res.json({ success: false, message: err.message });

        const [year, month, day] = dateStr.split("-").map(Number);
        const [hour, minute] = orario.split(":").map(Number);

        const event = {
          start: [year, month, day, hour, minute],
          duration: { hours: 1 },
          title: "Prenotazione Palestra",
          description: `Prenotazione di ${nome} alle ${orario}`,
          status: "CONFIRMED",
          busyStatus: "BUSY"
        };

        ics.createEvent(event, (error, value) => {
          if (error) console.error("Errore ICS:", error);

          if (sendClientMail) {
            const clientMailOptions = {
              from: "SClab96@gmail.com",
              to: email,
              subject: "Conferma prenotazione palestra",
              text: `Ciao ${nome}, la tua prenotazione è confermata per il ${dateStr} alle ${orario}.`,
              icalEvent: { filename: "prenotazione.ics", method: "REQUEST", content: value }
            };
            transporter.sendMail(clientMailOptions, (err, info) => {
              if (err) console.error("Errore invio mail cliente:", err);
              else console.log("Mail inviata al cliente:", info.response);
            });
          }

          const selfMailOptions = {
            from: "SClab96@gmail.com",
            to: "sclab96@gmail.com",
            subject: "Nuova prenotazione palestra",
            text: `Nuova prenotazione: ${nome}, ${email}, ${dateStr} alle ${orario}`,
            icalEvent: { filename: "prenotazione.ics", method: "REQUEST", content: value }
          };
          transporter.sendMail(selfMailOptions, (err, info) => {
            if (err) console.error("Errore invio mail rendiconto:", err);
            else console.log("Mail rendiconto inviata con ICS:", info.response);
          });

          res.json({ success: true, booking: { id: this.lastID, nome, email, orario, data: dateStr, pagato } });
        });
      }
    );
  });
});

// DELETE prenotazione (solo admin)
app.delete("/api/bookings/:id", adminAuth, (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM bookings WHERE id=?", [id], function(err) {
    if (err) return res.json({ success: false, message: err.message });
    res.json({ success: true });
  });
});

// PATCH prenotazione (solo admin)
app.patch("/api/bookings/:id", adminAuth, (req, res) => {
  const id = req.params.id;
  const fields = [];
  const values = [];

  for (const key of ["nome","email","data","orario","pagato"]) {
    if (req.body[key] !== undefined) {
      fields.push(`${key}=?`);
      if (key === "pagato") values.push(req.body[key] ? 1 : 0);
      else values.push(req.body[key]);
    }
  }

  if (fields.length === 0) return res.json({ success: false, message: "Nessun campo da aggiornare" });

  values.push(id);
  db.run(`UPDATE bookings SET ${fields.join(", ")} WHERE id=?`, values, function(err) {
    if (err) return res.json({ success: false, message: err.message });
    res.json({ success: true });
  });
});

// Root test
//app.get("/", (req, res) => res.send("Backend palestra funzionante!"));

// Serve i file statici del frontend
app.use(express.static(path.join(__dirname, "dist")));


// Tutte le altre richieste ritornano index.html (React Router)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


// Avvio server
app.listen(PORT, () => console.log(`Server avviato su port ${PORT}`));




