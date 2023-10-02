import React from 'react';
import { Underlyings } from './app/components/Underlyings';
import './App.css';
import { Routes, Route } from "react-router-dom";
import {Derivatives} from './app/components/Derivatives';


function App() {
  return (
    <div className="App">
      <br/>
        <Routes>
          <Route exact path="/" element={<App/>}/>
          <Route path="/underlyings" element={<Underlyings />} />
          <Route path="/derivatives" element={<Derivatives />} />
        </Routes>
    </div>
  );
}

export default App;
