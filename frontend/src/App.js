import React from "react";
import { Route, Routes } from "react-router-dom";
import ItemAdd from "./components/Item/ItemAdd";
import Home from "./components/Home/Home";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<ItemAdd />} />
        <Route path="/addItem" element={<ItemAdd />} />
      </Routes>
    </div>
  );
}

export default App;

