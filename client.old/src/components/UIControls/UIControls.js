import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Dropdown,
  ButtonGroup,
  DropdownButton,
  Button,
  OverlayTrigger,
} from "react-bootstrap";
import AddSprintModal from "../AddSprintModal/AddSprintModal";

import * as actionTypes from "../../store/actions/actionTypes";
import * as popover from "../Popovers/popoverSprintTable";

const UIControls = () => {
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

  const setSelectedYear = (year) => {
    dispatch({
      type: actionTypes.STATE_UPDATE_SELECTED_SPRINT_YEAR,
      year: year,
    });
  };

  const setSelectedSprint = (weekNum) => {
    dispatch({
      type: actionTypes.STATE_UPDATE_SELECTED_SPRINT_WEEK,
      weekNum: weekNum,
    });
  };

  const [showSprintAddModal, setSprintAddModal] = useState(false);
  const handleSprintAddModalClose = () => setSprintAddModal(false);
  const handleSprintAddModalShow = () => setSprintAddModal(true);

  useEffect(() => {
    if (sprints !== null || sprints !== {}) {
      const year = Object.keys(sprints).sort().pop();
      setSelectedYear(year);
      let week = null;
      if (sprints[year] !== undefined) {
        week = Object.keys(sprints[year]).sort().pop();
        setSelectedSprint(week);
      }
    }
    return () => {};
    // eslint-disable-next-line
  }, [sprints]);

  const sprintYears = Object.keys(sprints).map((year) => {
    return (
      <Dropdown.Item
        key={year}
        eventKey={year}
        onClick={() => setSelectedYear(year)}
        active={year === selectedSprint.year ? true : false}
      >
        {year}
      </Dropdown.Item>
    );
  });

  let sprintWeeks = [];
  if (sprints[selectedSprint.year] !== undefined)
    sprintWeeks = Object.keys(sprints[selectedSprint.year])
      .sort()
      .map((week) => {
        return (
          <Dropdown.Item
            key={week}
            eventKey={week}
            onClick={() => setSelectedSprint(week)}
            active={week === selectedSprint.weekNum ? true : false}
          >
            {week + " - " + sprints[selectedSprint.year][week].name}
          </Dropdown.Item>
        );
      });

  const handleSprintAddProjects = () => {
    dispatch({
      type: actionTypes.SPRINT_ADD_PROJECTS,
      year: selectedSprint.year,
      weekNum: selectedSprint.weekNum,
      projects: projects,
    });
  };

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
              {selectedSprintData !== null && selectedSprint.year} /{" "}
              {selectedSprintData !== null && selectedSprint.weekNum} -{" "}
              {selectedSprintData !== null && selectedSprintData.name}
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
    </Container>
  );
};

export default UIControls;
