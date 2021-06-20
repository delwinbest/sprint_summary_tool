import React from "react";
import { Container } from "react-bootstrap";
import "./App.css";

import NavBar from "./components/navigation/NavBar";
import SprintTable from "./components/SprintTable/SprintTable";

function App() {
  return (
    <Container>
      <NavBar />
      <br />
      <SprintTable />
    </Container>
  );
}

export default App;
