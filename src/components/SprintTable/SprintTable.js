import React, { useState } from "react";
import { useSelector } from "react-redux";
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

const SprintTable = () => {
  const sprints = useSelector((state) => state.sprints);

  const [selectedYear, setSelectedYear] = useState("2021");
  const [selectedSprint, setSelectedSprint] = useState("W01");

  const [showSprintAddModal, setSprintAddModal] = useState(false);
  const handleSprintAddModalClose = () => setSprintAddModal(false);
  const handleSprintAddModalShow = () => setSprintAddModal(true);

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

  return (
    <Container>
      <AddSprintModal
        closeModalHandler={handleSprintAddModalClose}
        showModal={showSprintAddModal}
      />
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
                <th>
                  <Row className="justify-content-md-center">
                    <Col>Alias</Col>
                    <Col>
                      <Button variant="outline-success" size="sm">
                        Add All
                      </Button>
                    </Col>
                  </Row>
                </th>
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
            </tbody>
          </Table>
        </Col>
        <Col>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Alias</th>
                <th>Day Capa.</th>
              </tr>
            </thead>
            <tbody>
              <tr key="dbest">
                <td>(days)</td>
                <td>dbest</td>
                <td>
                  <NumericInput min={0} max={14} value={10} />
                </td>
              </tr>
              <tr key="grattanj">
                <td>(days)</td>
                <td>grattanj</td>
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
