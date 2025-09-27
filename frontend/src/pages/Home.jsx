import React, { useEffect } from "react";
import "../index.css";

function Home() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "/manifest-home.json";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="home-page fade-anim">
      <h1>Benvenuto da | S&C | Claudio Damasco</h1>
      <p>Preparazioni, valutazioni, programmi personalizzati. Prenota il tuo allenamento!</p>

      <div className="home-images">
        <img src="/images/postura.jpg" alt="Allenamento 1" />
        <img src="/images/cla.jpg" alt="Claudio" />
        <img src="/images/postura2.jpg" alt="Allenamento 2" />
      </div>
    </div>
  );
}

export default Home;
