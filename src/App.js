import React from "react";
import { Container } from "react-bootstrap";
import "./App.scss";

import NavBar from "./components/navigation/NavBar";
import SprintTable from "./components/SprintTable/SprintTable";
import SelectedSprintSummary from "./components/SelectedSprintSummary/SelectedSprintSummary";
import SprintProjectSummary from "./components/SprintProjectSummary/SprintProjectSummary";
import KeySprintMetrics from "./components/KeySprintMetrics/KeySprintMetrics";

function App() {
  return (
    <Container>
      <NavBar />
      <br />
      <KeySprintMetrics />
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
