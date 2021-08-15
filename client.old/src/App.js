import React from "react";
import { Container } from "react-bootstrap";
import "./App.scss";

import NavBar from "./components/navigation/NavBar";
import SprintTable from "./components/SprintTable/SprintTable";
import SprintProjectSummary from "./components/SprintProjectSummary/SprintProjectSummary";
import KeySprintMetrics from "./components/KeySprintMetrics/KeySprintMetrics";
import UIControls from "./components/UIControls/UIControls";

function App() {
  return (
    <Container>
      <NavBar />
      <br />
      <UIControls />
      <br />
      <KeySprintMetrics />
      <br />
      <SprintTable />
      <br />
      <SprintProjectSummary />
    </Container>
  );
}

export default App;
