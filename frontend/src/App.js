import React from "react";
import { Route, Routes } from "react-router-dom";
import ItemAdd from "./components/Item/ItemAdd";
import Home from "./components/Home/Home";
import DisplayItem from "./components/DisplayItem/DisplayItem";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addItem" element={<ItemAdd />} />
        <Route path="/displayItem" element={<DisplayItem />} />
      </Routes>
    </div>
  );
}

export default App;

