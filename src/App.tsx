import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Three1 from './components/three1';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
        <Routes>  
          <Route path='learn1' element={<Three1 SCREEN_WIDTH={window.innerWidth} SCREEN_HEIGHT={window.innerHeight}/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
