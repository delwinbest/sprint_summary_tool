import React from "react";
import { Container, ProgressBar, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

const SelectedSprintSummary = () => {
  const sprints = useSelector((state) => state.sprints);
  const uistate = useSelector((state) => state.uistate);
  const projects = useSelector((state) => state.projects);

  const selectedSprint = uistate.selectedSprint;
  const selectedSprintData =
    sprints[selectedSprint.year][selectedSprint.weekNum];

  const nonProjects = Object.keys(projects).filter(
    (project) =>
      projects[project].type.startsWith("NON_PROJECT") &&
      projects[project].active === true
  );

  const businessProjects = Object.keys(projects).filter(
    (project) =>
      projects[project].type.startsWith("PROJECT") &&
      projects[project].active === true
  );

  const ootoProjects = Object.keys(projects).filter(
    (project) =>
      projects[project].type.startsWith("OOTO") &&
      projects[project].active === true
  );

  let ootoCapacity = 0;
  ootoProjects.forEach((project) => {
    Object.keys(selectedSprintData.capacity).forEach((member) => {
      if (selectedSprintData.capacity[member][project] !== undefined) {
        ootoCapacity += +selectedSprintData.capacity[member][project];
      }
    });
  });

  let projectCapacity = 0;
  businessProjects.forEach((project) => {
    Object.keys(selectedSprintData.capacity).forEach((member) => {
      if (selectedSprintData.capacity[member][project] !== undefined) {
        projectCapacity += +selectedSprintData.capacity[member][project];
      }
    });
  });

  let nonProjectCapacity = 0;
  nonProjects.forEach((project) => {
    Object.keys(selectedSprintData.capacity).forEach((member) => {
      if (selectedSprintData.capacity[member][project] !== undefined) {
        nonProjectCapacity += +selectedSprintData.capacity[member][project];
      }
    });
  });

  const totalCapacity =
    +selectedSprintData.sprintDurationDays * selectedSprintData.members.length;

  let content = <div>Add members to sprint</div>;

  if (totalCapacity > 0) {
    content = (
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
              now={((projectCapacity / totalCapacity) * 100).toFixed(2)}
              key={1}
              label={`PROJECT ${(
                (projectCapacity / totalCapacity) *
                100
              ).toFixed(2)}%`}
            />
            <ProgressBar
              variant="warning"
              now={((nonProjectCapacity / totalCapacity) * 100).toFixed(2)}
              key={2}
              label={`KTLO ${(
                (nonProjectCapacity / totalCapacity) *
                100
              ).toFixed(2)}%`}
            />
            <ProgressBar
              striped
              variant="info"
              now={((ootoCapacity / totalCapacity) * 100).toFixed(2)}
              key={3}
              label={`OOTO ${((ootoCapacity / totalCapacity) * 100).toFixed(
                2
              )}%`}
            />
          </ProgressBar>
        </Row>
      </Container>
    );
  }
  return <Container>{content}</Container>;
};

export default SelectedSprintSummary;
