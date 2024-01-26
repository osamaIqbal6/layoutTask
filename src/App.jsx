import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useRef } from "react";

import { useParams } from "react-router-dom";
import Uppercomponent from "./components/Uppercomponent";
import Lowercomponent from "./components/LowerComponent";
import Main from "./components/Main";
import "./index.css";
function ScrollToComponent({ componentToScrollTo }) {
  const scrollToRef = useRef(null);
  const { component } = useParams();

  useEffect(() => {
    // Scroll to the component element when the component mounts
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [component]);

  return (
    <div ref={scrollToRef}>
      {componentToScrollTo === "Uppercomponent" && <Uppercomponent />}
      {componentToScrollTo === "Lowercomponent" && <Lowercomponent />}
    </div>
  );
}

function App() {
  return <Main />;
}

export default App;
