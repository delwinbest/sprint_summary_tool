import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Table, Row, Col, Button, Form } from "react-bootstrap";
import SelectedSprintSummary from "../SelectedSprintSummary/SelectedSprintSummary";
import * as actionTypes from "../../store/actions/actionTypes";

const SprintTable = () => {
  const dispatch = useDispatch();
  const sprints = useSelector((state) => state.sprints);
  const team = useSelector((state) => state.team);
  const projects = useSelector((state) => state.projects);
  const uistate = useSelector((state) => state.uistate);

  // const [selectedYear, setSelectedYear] = useState("2021");
  // const [selectedSprint, setSelectedSprint] = useState("W01");
  const selectedSprint = uistate.selectedSprint;

  let selectedSprintData = null;
  if (
    sprints[selectedSprint.year] !== undefined &&
    sprints[selectedSprint.year][selectedSprint.weekNum] !== undefined
  )
    selectedSprintData = sprints[selectedSprint.year][selectedSprint.weekNum];

  const handleSprintAddTeam = () => {
    const capacity = selectedSprintData.capacity;
    team.teamMembers.forEach((member) => {
      if (selectedSprintData.capacity[member] === undefined) {
        capacity[member] = {};
      }
    });
    dispatch({
      type: actionTypes.SPRINT_ADD_MEMBERS,
      year: selectedSprint.year,
      weekNum: selectedSprint.weekNum,
      members: team.teamMembers,
      capacity: capacity,
    });
  };

  const handleEntryOnChange = (project, member, event) => {
    if (event.target.value === "" || event.target.value === "0") {
      dispatch({
        type: actionTypes.SPRINT_REMOVE_CAPACITY,
        year: selectedSprint.year,
        weekNum: selectedSprint.weekNum,
        employee: member,
        project: project,
      });
    } else {
      dispatch({
        type: actionTypes.SPRINT_ADD_CAPACITY,
        year: selectedSprint.year,
        weekNum: selectedSprint.weekNum,
        employee: member,
        project: project,
        days: +event.target.value,
      });
    }
  };
  let sprintMemberRows = [];
  if (selectedSprintData !== null)
    sprintMemberRows = selectedSprintData.members.map((member, index) => {
      let altStyle = {};
      if (index % 2 === 1) {
        altStyle = {
          backgroundColor: "#17a2b8",
          color: "#454d55",
        };
      }

      function getPropertySafely(object, defaultVal) {
        if (object !== undefined) return object;

        return defaultVal;
      }

      const calcMemberCapacityRemaining = (sprintCapacity, member) => {
        let memberCapacity = 0;
        Object.keys(selectedSprintData.capacity[member]).forEach((project) => {
          memberCapacity += +selectedSprintData.capacity[member][project];
        });
        return sprintCapacity - memberCapacity;
      };

      return (
        <tr key={member}>
          <td key={"units".member}>(days)</td>
          <td key={"username".member}>{member}</td>
          <td key={"days".member}>
            {calcMemberCapacityRemaining(
              +selectedSprintData.sprintDurationDays,
              member
            )}
          </td>
          {/* Holiday Section */}
          <td style={altStyle} key={"OOTO_" + member}>
            <Form.Control
              onChange={(event) => handleEntryOnChange("OOTO", member, event)}
              placeholder={getPropertySafely(
                selectedSprintData.capacity[member].OOTO,
                "..."
              )}
            />
          </td>
          <td style={altStyle} key={"Holiday_" + member}>
            <Form.Control
              onChange={(event) =>
                handleEntryOnChange("Holiday", member, event)
              }
              placeholder={getPropertySafely(
                selectedSprintData.capacity[member].Holiday,
                "..."
              )}
            />
          </td>
          {/* NonProject Section */}
          {selectedSprintData.projects
            .filter(
              (project) =>
                projects[project].type.startsWith("NON_PROJECT") &&
                projects[project].active
            )
            .map((project) => {
              return (
                <td key={project + "_" + member}>
                  <Form.Control
                    onChange={(event) =>
                      handleEntryOnChange(project, member, event)
                    }
                    placeholder={getPropertySafely(
                      selectedSprintData.capacity[member][project],
                      "..."
                    )}
                  />
                </td>
              );
            })}
          {/* Project Section */}
          {selectedSprintData.projects
            .filter(
              (project) =>
                projects[project].type.startsWith("PROJECT") &&
                projects[project].active
            )
            .map((project) => {
              return (
                <td style={altStyle} key={project + "_" + member}>
                  <Form.Control
                    onChange={(event) =>
                      handleEntryOnChange(project, member, event)
                    }
                    placeholder={getPropertySafely(
                      selectedSprintData.capacity[member][project],
                      "..."
                    )}
                  />
                </td>
              );
            })}
        </tr>
      );
    });

  let nonProjectTableHeaders = [];
  if (selectedSprintData !== null)
    nonProjectTableHeaders = selectedSprintData.projects
      .filter(
        (project) =>
          projects[project].type.startsWith("NON_PROJECT") &&
          projects[project].active
      )
      .map((project) => {
        return <th key={"header_" + project}>{project}</th>;
      });

  let projectTableHeaders = [];
  if (selectedSprintData !== null)
    projectTableHeaders = selectedSprintData.projects
      .filter(
        (project) =>
          projects[project].type.startsWith("PROJECT") &&
          projects[project].active
      )
      .map((project) => {
        return (
          <th style={{ backgroundColor: "#17a2b8" }} key={"header_" + project}>
            {project}
          </th>
        );
      });

  return (
    <Container>
      <SelectedSprintSummary />
      <br />
      <Row>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr key={"header"}>
              <th>Unit</th>
              <th style={{ textAlign: "center" }}>
                <Row className="justify-content-md-center">
                  <Col>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={handleSprintAddTeam}
                      style={{ fontSize: "0.5rem" }}
                    >
                      Add All
                    </Button>
                  </Col>
                  <Col>Alias</Col>
                </Row>
              </th>
              <th>Day Capa.</th>
              <th style={{ backgroundColor: "#17a2b8" }}>OOTO</th>
              <th style={{ backgroundColor: "#17a2b8" }}>Holiday</th>
              {nonProjectTableHeaders}
              {projectTableHeaders}
            </tr>
          </thead>
          <tbody>{sprintMemberRows}</tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default SprintTable;
