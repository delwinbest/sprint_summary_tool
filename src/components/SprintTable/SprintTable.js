import React, { useState, useEffect } from "react";
import "./SprintTable.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Table,
  Row,
  Col,
  Dropdown,
  ButtonGroup,
  DropdownButton,
  Button,
  OverlayTrigger,
  Form,
} from "react-bootstrap";
import AddSprintModal from "../AddSprintModal/AddSprintModal";
import * as actionTypes from "../../store/actions/actionTypes";
import * as popover from "../Popovers/popoverSprintTable";

const SprintTable = () => {
  const dispatch = useDispatch();
  const sprints = useSelector((state) => state.sprints);
  const team = useSelector((state) => state.team);
  const projects = useSelector((state) => state.projects);

  const [selectedYear, setSelectedYear] = useState("2021");
  const [selectedSprint, setSelectedSprint] = useState("W01");

  const [showSprintAddModal, setSprintAddModal] = useState(false);
  const handleSprintAddModalClose = () => setSprintAddModal(false);
  const handleSprintAddModalShow = () => setSprintAddModal(true);

  const currentSprint = sprints[selectedYear][selectedSprint];

  useEffect(() => {
    const year = Object.keys(sprints).pop();
    const week = Object.keys(sprints[year]).pop();
    setSelectedYear(year);
    setSelectedSprint(week);
    return () => {};
    // eslint-disable-next-line
  }, []);

  const sprintYears = Object.keys(sprints).map((year) => {
    return (
      <Dropdown.Item
        key={year}
        eventKey={year}
        onClick={() => setSelectedYear(year)}
        active={year === selectedYear ? true : false}
      >
        {year}
      </Dropdown.Item>
    );
  });
  const sprintWeeks = Object.keys(sprints[selectedYear]).map((week) => {
    return (
      <Dropdown.Item
        key={week}
        eventKey={week}
        onClick={() => setSelectedSprint(week)}
        active={week === selectedSprint ? true : false}
      >
        {week}
      </Dropdown.Item>
    );
  });

  const handleSprintAddProjects = () => {
    dispatch({
      type: actionTypes.SPRINT_ADD_PROJECTS,
      year: selectedYear,
      weekNum: selectedSprint,
      projects: Object.keys(projects),
    });
  };

  const handleSprintAddTeam = () => {
    const capacity = currentSprint.capacity;
    team.teamMembers.forEach((member) => {
      if (currentSprint.capacity[member] === undefined) {
        capacity[member] = {};
      }
    });
    dispatch({
      type: actionTypes.SPRINT_ADD_MEMBERS,
      year: selectedYear,
      weekNum: selectedSprint,
      members: team.teamMembers,
      capacity: capacity,
    });
  };

  const addSprintButton = (
    <div
      className=""
      style={{
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
    >
      <Button
        variant="outline-success"
        block
        onClick={handleSprintAddModalShow}
      >
        Add Sprint
      </Button>
    </div>
  );
  const yearDropdown = ["Info"].map((variant) => (
    <DropdownButton
      as={ButtonGroup}
      key={"yearSelector"}
      id={`dropdown-variants-Info`}
      variant={"info"}
      title={"Year"}
      style={{ paddingLeft: "0.2rem", paddingBottom: "0.2rem" }}
    >
      {sprintYears}
      {addSprintButton}
    </DropdownButton>
  ));

  const sprintDropdown = ["Info"].map((variant) => (
    <DropdownButton
      as={ButtonGroup}
      key={"sprintSelector"}
      id={`dropdown-variants-Info`}
      variant={"info"}
      title={"Sprint"}
      style={{
        paddingLeft: "0.2rem",
        paddingBottom: "0.2rem",
      }}
    >
      {sprintWeeks}
      {addSprintButton}
    </DropdownButton>
  ));

  const handleEntryOnChange = (project, member, event) => {
    if (event.target.value === "" || event.target.value === "0") {
      dispatch({
        type: actionTypes.SPRINT_REMOVE_CAPACITY,
        year: selectedYear,
        weekNum: selectedSprint,
        employee: member,
        project: project,
      });
    } else {
      dispatch({
        type: actionTypes.SPRINT_ADD_CAPACITY,
        year: selectedYear,
        weekNum: selectedSprint,
        employee: member,
        project: project,
        days: event.target.value,
      });
    }
  };

  const sprintMemberRows = currentSprint.members.map((member, index) => {
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
      Object.keys(currentSprint.capacity[member]).forEach((project) => {
        memberCapacity += +currentSprint.capacity[member][project];
      });
      return sprintCapacity - memberCapacity;
    };

    return (
      <tr key={member}>
        <td key={"units".member}>(days)</td>
        <td key={"username".member}>{member}</td>
        <td key={"days".member}>
          {calcMemberCapacityRemaining(
            +currentSprint.sprintDurationDays,
            member
          )}
        </td>
        {/* Holiday Section */}
        <td style={altStyle} key={"OOTO_" + member}>
          <Form.Control
            onBlur={(event) => handleEntryOnChange("OOTO", member, event)}
            placeholder={getPropertySafely(
              currentSprint.capacity[member].OOTO,
              "..."
            )}
          />
        </td>
        <td style={altStyle} key={"Holidays_" + member}>
          <Form.Control
            onBlur={(event) => handleEntryOnChange("Holidays", member, event)}
            placeholder={getPropertySafely(
              currentSprint.capacity[member].Holidays,
              "..."
            )}
          />
        </td>
        {/* NonProject Section */}
        {currentSprint.projects
          .filter(
            (project) =>
              projects[project].type.startsWith("NON_PROJECT") &&
              projects[project].active
          )
          .map((project) => {
            return (
              <td key={project + "_" + member}>
                <Form.Control
                  onBlur={(event) =>
                    handleEntryOnChange(project, member, event)
                  }
                  placeholder={getPropertySafely(
                    currentSprint.capacity[member][project],
                    "..."
                  )}
                />
              </td>
            );
          })}
        {/* Project Section */}
        {currentSprint.projects
          .filter(
            (project) =>
              projects[project].type.startsWith("PROJECT") &&
              projects[project].active
          )
          .map((project) => {
            return (
              <td style={altStyle} key={project + "_" + member}>
                <Form.Control
                  onBlur={(event) =>
                    handleEntryOnChange(project, member, event)
                  }
                  placeholder={getPropertySafely(
                    currentSprint.capacity[member][project],
                    "..."
                  )}
                />
              </td>
            );
          })}
      </tr>
    );
  });

  const nonProjectTableHeaders = currentSprint.projects
    .filter(
      (project) =>
        projects[project].type.startsWith("NON_PROJECT") &&
        projects[project].active
    )
    .map((project) => {
      return <th key={"header_" + project}>{project}</th>;
    });

  const projectTableHeaders = currentSprint.projects
    .filter(
      (project) =>
        projects[project].type.startsWith("PROJECT") && projects[project].active
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
      <AddSprintModal
        closeModalHandler={handleSprintAddModalClose}
        showModal={showSprintAddModal}
      />
      <Row>
        <Col as={Row}>
          {yearDropdown}
          {sprintDropdown}
          &nbsp;&nbsp;
          <div style={{ display: "inline-block" }}>
            <h4>
              {selectedYear} / {selectedSprint} - {currentSprint.name}
            </h4>
          </div>
        </Col>
        <Col>
          <OverlayTrigger
            overlay={popover.addTeam}
            delay={{ show: 250, hide: 400 }}
          >
            <span className="d-inline-block" style={{ paddingRight: ".2rem" }}>
              <Button variant="success" onClick={handleSprintAddTeam}>
                Add Team to Sprint
              </Button>
            </span>
          </OverlayTrigger>
          <Button variant="success" onClick={handleSprintAddProjects}>
            Add Active Projects
          </Button>{" "}
        </Col>
      </Row>
      <Row>
        <Col>
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
                <th style={{ backgroundColor: "#17a2b8" }}>Holidays</th>
                {nonProjectTableHeaders}
                {projectTableHeaders}
              </tr>
            </thead>
            <tbody>{sprintMemberRows}</tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default SprintTable;
