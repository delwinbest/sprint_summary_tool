import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Table,
  Row,
  Col,
  Dropdown,
  ButtonGroup,
  DropdownButton,
} from "react-bootstrap";
import NumericInput from "react-numeric-input";
import AddSprintModal from "../AddSprintModal/AddSprintModal";

const SprintTable = () => {
  const sprints = useSelector((state) => state.sprints);

  const [selectedYear, setSelectedYear] = useState("2020");
  const [selectedSprint, setSelectedSprint] = useState("W01");

  const sprintYears = Object.keys(sprints).map((year) => {
    return (
      <Dropdown.Item
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
        eventKey={week}
        onClick={() => setSelectedSprint(week)}
        active={week === selectedSprint ? true : false}
      >
        {week}
      </Dropdown.Item>
    );
  });
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
    </DropdownButton>
  ));

  const sprintDropdown = ["Info"].map((variant) => (
    <DropdownButton
      as={ButtonGroup}
      key={"sprintSelector"}
      id={`dropdown-variants-Info`}
      variant={"info"}
      title={"Sprint"}
      style={{ paddingLeft: "0.2rem", paddingBottom: "0.2rem" }}
    >
      {sprintWeeks}
    </DropdownButton>
  ));

  return (
    <Container>
      <AddSprintModal />
      <Row>
        <Col>
          {yearDropdown}
          {sprintDropdown}
        </Col>
        <Col></Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Alias [Add Team Button]</th>
                <th>Day Capa.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>(days)</td>
                <td>dbest</td>
                <td>
                  <NumericInput min={0} max={14} value={10} />
                </td>
              </tr>
              <tr>
                <td>(days)</td>
                <td>grattanj</td>
                <td>10</td>
              </tr>
              <tr>
                <td>(days)</td>
                <td>kitsune</td>
                <td>10</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Alias [Add Team Button]</th>
                <th>Day Capa.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>(days)</td>
                <td>dbest</td>
                <td>
                  <NumericInput min={0} max={14} value={10} />
                </td>
              </tr>
              <tr>
                <td>(days)</td>
                <td>grattanj</td>
                <td>10</td>
              </tr>
              <tr>
                <td>(days)</td>
                <td>kitsune</td>
                <td>10</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default SprintTable;
