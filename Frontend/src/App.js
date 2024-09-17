import React from 'react';
import './App.css';
import RegistroForm from './components/RegistroForm';
const backgroundImage = require('../src/fond.jpg');

function App() {
  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <RegistroForm />
    </div>
  );
}

export default App;
