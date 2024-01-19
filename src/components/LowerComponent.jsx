import React from "react";

function Lowercomponent({ secondobjects }) {
  return (
    <div className="lower-box">
      <ul>
        {secondobjects.map((obj) => (
         <div key={obj.id} className="object-container">
         <h2>{obj.heading}</h2>
         <textarea value={obj.text}></textarea>
       </div>
        ))}
      </ul>
    </div>
  );
}

export default Lowercomponent;
