import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useRef } from "react";

import { useParams } from "react-router-dom";
import Main from "./components/Main";
import "./index.css";

function App() {
  return <Main />;
}

export default App;
