import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Demo from "../pages/Demo";
import Boiler from "../pages/Boiler";
import CIP from "../pages/CIP";
import Agents from "../pages/Agents";
import Value from "../pages/Value";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/boiler" element={<Boiler />} />
        <Route path="/cip" element={<CIP />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/value" element={<Value />} />
      </Routes>
    </BrowserRouter>
  );
}
