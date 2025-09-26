import React from "react";

export default function Loader({ visible }) {
  return (
    <div className={`loader-overlay ${visible ? "show" : ""}`}>
      <img src="/images/sc.png" alt="Logo" className="loader-logo" />
    </div>
  );
}
