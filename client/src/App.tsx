import React from 'react';
import { Container } from 'react-bootstrap';
import './App.css';
import Header from './components/header/Header';

function App() {
  return (
    <div className="App">
      <Container>
        <Header />
      </Container>
    </div>
  );
}

export default App;
