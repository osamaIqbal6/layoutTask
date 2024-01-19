import React from "react";


function Uppercomponent({ firstObjects }) {
  return (
    <div className="centered-box">
      {firstObjects.map((obj) => (
        <div key={obj.id} className="object-container">
          <h2>{obj.heading}</h2>
          <textarea value={obj.text}></textarea>
        </div>
      ))}
    </div>
  );
}


export default Uppercomponent;
