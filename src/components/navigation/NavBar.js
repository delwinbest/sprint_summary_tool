import React, { useState } from "react";
import { Button, Badge, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Bricks } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";

import AddUserModal from "../Users/AddUserModal";

const NavBar = () => {
  const team = useSelector((state) => state.team);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const removeMemberHandler = (username) => {
    dispatch({ type: actionTypes.TEAM_REMOVE_MEMBER, username: username });
  };

  const teamList = team.teamMembers.map((employee) => {
    return (
      <NavDropdown.Item>
        <Badge variant="danger" onClick={() => removeMemberHandler(employee)}>
          -
        </Badge>
        <span style={{ paddingLeft: "1rem" }}>{employee}</span>
      </NavDropdown.Item>
    );
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
            <Nav.Link href="#home">Home</Nav.Link>
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
