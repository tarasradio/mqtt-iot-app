import React from 'react';
import ReactDOM from 'react-dom';
import { 
  BrowserRouter, 
  Routes,
  Route 
} from "react-router-dom";

import HeartControl from './routes/HeartControl';
import RobotControl from './routes/RobotControl';

import './index.css';

import App from './App';
import NavBar from './components/NavBar';

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <NavBar/>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="heart" element={<HeartControl />} />
      <Route path="robot" element={<RobotControl />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
