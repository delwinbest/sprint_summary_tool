import React from "react";
import { Container, Table, Row, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";
import * as services from "../../services/index";

const SprintProjectSummary = () => {
  const dispatch = useDispatch();
  const sprints = useSelector((state) => state.sprints);
  const uistate = useSelector((state) => state.uistate);

  const selectedSprint = uistate.selectedSprint;
  let selectedSprintData = null;
  if (
    sprints[selectedSprint.year] !== undefined &&
    sprints[selectedSprint.year][selectedSprint.weekNum] !== undefined
  )
    selectedSprintData = sprints[selectedSprint.year][selectedSprint.weekNum];

  function getPropertySafely(object, defaultVal) {
    if (object !== undefined) return object;

    return defaultVal;
  }
  const handleEntryOnChange = (project, dataType, event) => {
    // Expect project, dataType, data

    if (event.target.value === "") {
      dispatch({
        type: actionTypes.SPRINT_ADD_STORY_DATA,
        year: selectedSprint.year,
        weekNum: selectedSprint.weekNum,
        project: project,
        dataType: dataType,
        data: 0,
      });
    } else {
      dispatch({
        type: actionTypes.SPRINT_ADD_STORY_DATA,
        year: selectedSprint.year,
        weekNum: selectedSprint.weekNum,
        project: project,
        dataType: dataType,
        data: +event.target.value,
      });
    }
  };

  const projectSummmary = Object.keys(selectedSprintData.storyData).map(
    (project) => {
      let projectDays = 0;
      const projectData = selectedSprintData.storyData[project];

      Object.keys(selectedSprintData.capacity).forEach((member) => {
        if (selectedSprintData.capacity[member][project] !== undefined) {
          projectDays += +selectedSprintData.capacity[member][project];
        }
      });
      const storyDataCells = [
        "pointsPlanned",
        "tasksPlanned",
        "pointsCompleted",
        "tasksCompleted",
      ].map((attribute) => {
        return (
          <td>
            <Form.Control
              onChange={(event) =>
                handleEntryOnChange(project, attribute, event)
              }
              placeholder={getPropertySafely(projectData[attribute], "...")}
            />
          </td>
        );
      });

      return (
        <tr key={project}>
          {/* HEADERS: 
          <th>Days</th>
          <th>Point Capacity</th>
          <th>Points Planned</th>
          <th>Story Count</th>
          <th>Points Completed</th>
          <th>Story Count Completed</th>
          <th>Planned Velocity</th>
          <th>End Velocity</th> */}
          <td>{project}</td>
          <td>{projectDays}</td>
          {/* FIXME: HARDCODED VELOCITY 0.2 */}
          <td>{(projectDays * 0.2).toFixed(2)}</td>
          {storyDataCells}
          <td>
            {services.calculateVelocity(projectData.pointsPlanned, projectDays)}
          </td>
          <td>
            {services.calculateVelocity(
              projectData.pointsCompleted,
              projectDays
            )}
          </td>
        </tr>
      );
    }
  );

  return (
    <Container>
      <Row>
        Note: (Point Capacity is Optimal: 0.20 velocity hard coded)
        <Table striped bordered hover variant="dark">
          <thead>
            <tr key={"header"}>
              <th></th>
              <th>Days</th>
              <th>Point Capacity</th>
              <th>Points Planned</th>
              <th>Story Count</th>
              <th>Points Completed</th>
              <th>Story Count Completed</th>
              <th>Planned Velocity</th>
              <th>End Velocity</th>
            </tr>
          </thead>
          <tbody>{projectSummmary}</tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default SprintProjectSummary;
