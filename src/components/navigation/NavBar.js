import React, { useState } from "react";
import { Button, Badge, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Bricks } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";

import AddUserModal from "../Users/AddUserModal";

const NavBar = () => {
  const team = useSelector((state) => state.team);
  const projects = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const removeMemberHandler = (username) => {
    dispatch({ type: actionTypes.TEAM_REMOVE_MEMBER, username: username });
  };

  const teamList = team.teamMembers.map((employee) => {
    return (
      <NavDropdown.Item key={employee}>
        <Badge variant="danger" onClick={() => removeMemberHandler(employee)}>
          -
        </Badge>
        <span style={{ paddingLeft: "1rem" }}>{employee}</span>
      </NavDropdown.Item>
    );
  });

  const nonProjectList = Object.keys(projects).map((project) => {
    if (projects[project].type.startsWith("NON_PROJECT")) {
      return (
        <NavDropdown.Item key={project}>
          <Badge variant="danger" onClick={() => removeMemberHandler(project)}>
            -
          </Badge>
          <span style={{ paddingLeft: "1rem" }}>{project}</span>
        </NavDropdown.Item>
      );
    }
    return null;
  });

  const projectList = Object.keys(projects).map((project) => {
    console.log(projects[project].type);
    if (projects[project].type.startsWith("PROJECT")) {
      return (
        <NavDropdown.Item key={project}>
          <Badge variant="danger" onClick={() => removeMemberHandler(project)}>
            -
          </Badge>
          <span style={{ paddingLeft: "1rem" }}>{project}</span>
        </NavDropdown.Item>
      );
    }
    return null;
  });
  return (
    <React.Fragment>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          <Bricks color="lightblue" /> Sprint Planner
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Projects" id="basic-nav-dropdown">
              {projectList}
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <Button variant="outline-success" onClick={handleModalShow}>
                  Create New
                </Button>
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Non Projects" id="basic-nav-dropdown">
              {nonProjectList}
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <Button variant="outline-success" onClick={handleModalShow}>
                  Create New
                </Button>
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Team Members" id="basic-nav-dropdown">
              {teamList}
              <NavDropdown.Divider />
              <NavDropdown.Item>
                <Button variant="outline-success" onClick={handleModalShow}>
                  Add New Member
                </Button>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <AddUserModal
        closeModalHandler={handleModalClose}
        showModal={showModal}
      />
    </React.Fragment>
  );
};

export default NavBar;
