import React from "react";
import "../Centerbox.css";

function Uppercomponent({ firstObjects }) {
  const handleDownloadClick = async () => {
    const response = await fetch("http://192.168.18.57:3001/generate-pdf");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "page.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  return (
    <div className="centered-box">
      <button onClick={handleDownloadClick} style={{ marginBottom: 10 }}>
        Download as PDF
      </button>
      <textarea
        style={{
          fontSize: 20,
          height: `100px`,
          overflow: "hidden",
          marginBottom: 10,
        }}
      ></textarea>
      <textarea
        style={{
          fontSize: 20,
          height: `100px`,
          overflow: "hidden",
          marginBottom: 10,
        }}
      ></textarea>
      <textarea
        style={{
          fontSize: 20,
          height: `100px`,
          overflow: "hidden",
          marginBottom: 10,
        }}
      ></textarea>
      <textarea
        style={{
          fontSize: 20,
          height: `100px`,
          overflow: "hidden",
          marginBottom: 10,
        }}
      ></textarea>
    </div>
  );
}

export default Uppercomponent;
