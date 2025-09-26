import React, { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 2000); // durata splash (2s)
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    visible && (
      <div className="splash-overlay">
        <img src="/images/sc.png" alt="Logo" className="splash-logo" />
      </div>
    )
  );
}
