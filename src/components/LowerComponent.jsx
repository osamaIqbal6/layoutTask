import React from "react";
import "../Centerbox.css";

function Lowercomponent({ secondobjects }) {
  return (
    <div className="lower-box">
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

export default Lowercomponent;
