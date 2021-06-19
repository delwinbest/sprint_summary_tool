import React, { useState, useEffect } from "react";
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
} from "react-bootstrap";
import NumericInput from "react-numeric-input";
import AddSprintModal from "../AddSprintModal/AddSprintModal";
import * as actionTypes from "../../store/actions/actionTypes";

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
    console.log(Object.keys(projects));
    dispatch({
      type: actionTypes.SPRINT_ADD_PROJECTS,
      year: selectedYear,
      weekNum: selectedSprint,
      projects: Object.keys(projects),
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

  const sprintMemberRows = sprints[selectedYear][selectedSprint].members.map(
    (member, index) => {
      let altStyle = {
        textAlign: "center",
      };
      if (index % 2 === 1) {
        altStyle = {
          backgroundColor: "#FBFCFC",
          color: "#454d55",
          textAlign: "center",
        };
      }

      return (
        <tr key={member}>
          <td>(days)</td>
          <td
            style={{
              textAlign: "center",
            }}
          >
            {member}
          </td>
          <td>
            <NumericInput
              min={0}
              max={14}
              value={10}
              style={{ input: { width: "3rem" } }}
            />
          </td>
          {/* Holiday Section */}
          <td style={altStyle}>...</td>
          <td style={altStyle}>...</td>
          {/* NonProject Section */}
          {sprints[selectedYear][selectedSprint].projects
            .filter(
              (project) =>
                projects[project].type.startsWith("NON_PROJECT") &&
                projects[project].active
            )
            .map((project) => {
              return <td>{project}</td>;
            })}
          {/* Project Section */}
          {sprints[selectedYear][selectedSprint].projects
            .filter(
              (project) =>
                projects[project].type.startsWith("PROJECT") &&
                projects[project].active
            )
            .map((project) => {
              return <td style={altStyle}>{project}</td>;
            })}
        </tr>
      );
    }
  );

  const nonProjectTableHeaders = sprints[selectedYear][selectedSprint].projects
    .filter(
      (project) =>
        projects[project].type.startsWith("NON_PROJECT") &&
        projects[project].active
    )
    .map((project) => {
      return <th>{project}</th>;
    });

  const projectTableHeaders = sprints[selectedYear][selectedSprint].projects
    .filter(
      (project) =>
        projects[project].type.startsWith("PROJECT") && projects[project].active
    )
    .map((project) => {
      return (
        <th style={{ backgroundColor: "#FBFCFC", color: "#454d55" }}>
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
              {selectedYear} / {selectedSprint} -{" "}
              {sprints[selectedYear][selectedSprint].name}
            </h4>
          </div>
        </Col>
        <Col>
          <Button variant="success" onClick={handleSprintAddProjects}>
            Add Active Projects
          </Button>{" "}
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Unit</th>
                <th style={{ textAlign: "center" }}>
                  <Row className="justify-content-md-center">
                    <Col>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => {
                          dispatch({
                            type: actionTypes.SPRINT_ADD_MEMBERS,
                            year: selectedYear,
                            weekNum: selectedSprint,
                            members: team.teamMembers,
                          });
                        }}
                        style={{ fontSize: "0.5rem" }}
                      >
                        Add All
                      </Button>
                    </Col>
                    <Col>Alias</Col>
                  </Row>
                </th>
                <th>Day Capa.</th>
                {/* 1px solid #dee2e6 */}
                <th style={{ backgroundColor: "#FBFCFC", color: "#454d55" }}>
                  OOTO
                </th>
                <th style={{ backgroundColor: "#FBFCFC", color: "#454d55" }}>
                  Holidays
                </th>
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
