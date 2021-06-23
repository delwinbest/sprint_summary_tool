import React from "react";
import { Container, ProgressBar, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as services from "../../services/index";

const SelectedSprintSummary = () => {
  const sprints = useSelector((state) => state.sprints);
  const uistate = useSelector((state) => state.uistate);
  const projects = useSelector((state) => state.projects);

  const selectedSprint = uistate.selectedSprint;
  const selectedSprintData =
    sprints[selectedSprint.year][selectedSprint.weekNum];

  // Get the capacity assigned to Non Projects in this Sprint
  // Get the capacity assigned to Business Projects in this Sprint
  // Get the capacity assigned to OOTO in this Sprint
  const {
    nonProjectCapacity,
    businessProjectCapacity,
    ootoCapacity,
    totalSprintCapacity,
  } = services.calculateSprintCapacity(selectedSprintData, projects);

  let progressbar = <div>Add members to sprint</div>;

  const keySprintMetrics = (
    <Container>
      <Table striped bordered hover>
        <thead>
          <tr key={"header"}>
            <th>week</th>
            <th>Sprint Name</th>
            <th>Day Capacity</th>
            <th>Point Capacity</th>
            <th>Points Planned</th>
            <th>Story Count</th>
            <th>Points Completed</th>
            <th>Story Count Completed</th>
            <th>Trailing Velocity</th>
            <th>Planned Velocity</th>
            <th>End Velocity</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>W23</td>
            <td></td>
          </tr>
          <tr>
            <td>W24</td>
            <td></td>
          </tr>
          <tr>
            <td>W25</td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );

  if (totalSprintCapacity > 0) {
    progressbar = (
      <Container>
        <Row style={{ alignItems: "center", flexBasis: "auto" }}>
          <div
            style={{
              padding: "0.2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            Sprint Capacity
          </div>
          <ProgressBar style={{ flexGrow: "1" }}>
            <ProgressBar
              striped
              variant="success"
              now={(
                (businessProjectCapacity / totalSprintCapacity) *
                100
              ).toFixed(2)}
              key={1}
              label={`PROJECT ${(
                (businessProjectCapacity / totalSprintCapacity) *
                100
              ).toFixed(2)}%`}
            />
            <ProgressBar
              variant="warning"
              now={((nonProjectCapacity / totalSprintCapacity) * 100).toFixed(
                2
              )}
              key={2}
              label={`KTLO ${(
                (nonProjectCapacity / totalSprintCapacity) *
                100
              ).toFixed(2)}%`}
            />
            <ProgressBar
              striped
              variant="info"
              now={((ootoCapacity / totalSprintCapacity) * 100).toFixed(2)}
              key={3}
              label={`OOTO ${(
                (ootoCapacity / totalSprintCapacity) *
                100
              ).toFixed(2)}%`}
            />
          </ProgressBar>
        </Row>
      </Container>
    );
  }
  return (
    <React.Fragment>
      {keySprintMetrics}
      <Container>{progressbar}</Container>
    </React.Fragment>
  );
};

export default SelectedSprintSummary;
