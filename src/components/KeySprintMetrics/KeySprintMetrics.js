import React from "react";
import { Container, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as services from "../../services/index";

const KeySprintMetrics = () => {
  // This Modal builds a view of the last XX (3?) Sprints, can calculates running metrics (6 month velocity, etc)
  const sprints = useSelector((state) => state.sprints);
  const projects = useSelector((state) => state.projects);

  const currentYear = Object.keys(sprints).pop();
  const sprintnumbertoshow = 3;
  const sprintnumbertoaverage = 6;

  // Let's get the $'sprintnumbertoshow' recent sprints
  const sprintsToShow = Object.keys(sprints[currentYear])
    .slice(-sprintnumbertoshow)
    .sort();

  // Build the table rows for the selected sprints
  const keyMetricsData = sprintsToShow.map((weekNum) => {
    const sprintData = sprints[currentYear][weekNum];

    // Get Sprint Stats
    const {
      // nonProjectCapacity,
      businessProjectCapacity,
      // ootoCapacity,
      //totalSprintCapacity,
    } = services.calculateSprintCapacity(sprintData, projects);

    const { pointsCompleted, pointsPlanned, tasksCompleted, tasksPlanned } =
      services.calculateTotalSprintStoryTotal(sprintData);

    // FIXME: HARDCODED AVG VELOCITY
    const averagevelocity = 0.2;
    const { trailingSprintVelocity } = services.calculateTrailingVelocity(
      sprints[currentYear],
      weekNum,
      sprintnumbertoaverage,
      projects
    );

    const sprintPointCapacity = (
      businessProjectCapacity * averagevelocity
    ).toFixed(2);
    return (
      <tr key={weekNum}>
        <td>{weekNum}</td>
        <td>{sprintData.name}</td>
        <td>{businessProjectCapacity}</td>
        <td>{sprintPointCapacity}</td>
        <td>{pointsPlanned}</td>
        <td>{tasksPlanned}</td>
        <td>{pointsCompleted}</td>
        <td>{tasksCompleted}</td>
        <td>{trailingSprintVelocity}</td>
        <td>
          {services.calculateVelocity(pointsPlanned, businessProjectCapacity)}
        </td>
        <td>
          {services.calculateVelocity(pointsCompleted, businessProjectCapacity)}
        </td>
      </tr>
    );
  });

  return (
    <Container>
      <Table striped bordered hover>
        <thead>
          <tr key={"header"}>
            <th>week</th>
            <th>Sprint Name</th>
            <th>Proj. Day Capacity</th>
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
        <tbody>{keyMetricsData}</tbody>
      </Table>
    </Container>
  );
};

export default KeySprintMetrics;
