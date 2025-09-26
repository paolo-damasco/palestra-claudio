import React, { useEffect, useRef, useState } from "react";

export default function About() {
  const [visible, setVisible] = useState(false);
  const aboutRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-section">
      <div
        className={`about-card fade-anim`}
        ref={aboutRef}
      >
        <div className="about-image">
          <img src="/images/cla2.jpg" alt="Claudio Damasco" />
          <h2 className="about-name">Claudio Damasco</h2>
        </div>
        <div className={`about-text ${visible ? "visible" : ""}`}>
	  <h3>Informazioni personali</h3>
          <p><strong>Data di nascita:</strong> 20/06/1996</p>
          <p><strong>Residenza:</strong> Monopoli, Bari</p>
          <p><strong>Telefono:</strong> +39 3347040799</p>
          <p><strong>Email:</strong> sclab96@gmail.com</p>

          <h3>Formazione</h3>
          <p>Laurea magistrale in Scienze Motorie</p>
          <p>Master in Posturologia</p>
          <p>HIIT & Power expert</p>
          <p>Sport specialist</p>

          <h3>Esperienza lavorativa</h3>
          <p>Personal Trainer presso Olistick</p>
          <p>Personal Trainer One to One & Couple Training</p>
          <p>Postural Training</p>
          <p>Specializzato in allenamenti per le forze dell'ordine, sport (calcio) e recupero infortuni. Ha partecipato a convegni, fiere e TV.</p>

          <h3>Competenze</h3>
          <p>Preparazione atletica</p>
          <p>Preparazione schede personalizzate</p>
          <p>Valutazione posturale</p>
        </div>
      </div>
    </div>
  );
}
