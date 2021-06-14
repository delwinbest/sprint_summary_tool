import React, { useState, useRef } from "react";
import {
  Button,
  Row,
  Card,
  Badge,
  Container,
  Modal,
  InputGroup,
  Form,
  ListGroup,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import * as actionTypes from "./store/actions/actionTypes";

function App() {
  const dispatch = useDispatch();
  const team = useSelector((state) => state.team);

  const [showModal, setShowModal] = useState(false);
  const newMemberRef = useRef();

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const addMemberHandler = (username) => {
    dispatch({ type: actionTypes.TEAM_ADD_MEMBER, username: username });
  };

  const removeMemberHandler = (username) => {
    dispatch({ type: actionTypes.TEAM_REMOVE_MEMBER, username: username });
  };

  const teamList = team.teamMembers.map((employee) => {
    return (
      <ListGroup.Item key={employee}>
        <Badge variant="danger" onClick={() => removeMemberHandler(employee)}>
          -
        </Badge>
        <span style={{ "padding-left": "1rem" }}>{employee}</span>
      </ListGroup.Item>
    );
  });

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Card style={{ width: "18rem" }}>
          <Card.Header>Team Members</Card.Header>
          <ListGroup variant="flush">{teamList} </ListGroup>
          <Button variant="outline-success" onClick={handleModalShow}>
            Add New Member
          </Button>
        </Card>
      </Row>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Team Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="username"
              aria-label="username"
              aria-describedby="basic-addon2"
              ref={newMemberRef}
            />
            <InputGroup.Append>
              <InputGroup.Text id="basic-addon2">@amazon.com</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              addMemberHandler(newMemberRef.current.value);
              handleModalClose();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
