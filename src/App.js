import React from "react";
import { Container } from "react-bootstrap";
import "./App.css";

import NavBar from "./components/navigation/NavBar";
import SprintTable from "./components/SprintTable/SprintTable";
import SelectedSprintSummary from "./components/SelectedSprintSummary/SelectedSprintSummary";
import SprintProjectSummary from "./components/SprintProjectSummary/SprintProjectSummary";

function App() {
  return (
    <Container>
      <NavBar />
      <br />
      <SelectedSprintSummary />
      <br />
      <SprintTable />
      <br />
      <SprintProjectSummary />
    </Container>
  );
}

export default App;
