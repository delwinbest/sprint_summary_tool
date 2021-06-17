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
      let altStyle = {};
      if (index % 2 === 1) {
        altStyle = { backgroundColor: "#FBFCFC", color: "#454d55" };
      }

      return (
        <tr key={member}>
          <td>(days)</td>
          <td>{member}</td>
          <td>
            <NumericInput min={0} max={14} value={10} />
          </td>
          {/* Holiday Section */}
          <td style={altStyle}>{index}</td>
          <td style={altStyle}>{index}</td>
        </tr>
      );
    }
  );

  return (
    <Container>
      <AddSprintModal
        closeModalHandler={handleSprintAddModalClose}
        showModal={showSprintAddModal}
      />
      <Row>
        <Col row>
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
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Unit</th>
                <th>
                  <Row className="justify-content-md-center">
                    <Col>Alias</Col>
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
                      >
                        Add All
                      </Button>
                    </Col>
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
