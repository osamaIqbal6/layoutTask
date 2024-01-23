import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useRef } from "react";

import { useParams } from "react-router-dom";
import Uppercomponent from "./components/Uppercomponent";
import Lowercomponent from "./components/LowerComponent";

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

function Routing() {
  return (
    <Router>
      <div className="maindiv">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ScrollToComponent componentToScrollTo="Uppercomponent" />
                <ScrollToComponent componentToScrollTo="Lowercomponent" />
              </>
            }
          />
          <Route
            path="/1"
            element={<ScrollToComponent componentToScrollTo="Uppercomponent" />}
          />
          <Route
            path="/2"
            element={<ScrollToComponent componentToScrollTo="Lowercomponent" />}
          />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default Routing;
