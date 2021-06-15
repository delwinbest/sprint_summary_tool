import React, { useRef } from "react";
import { Button, Modal, InputGroup, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";

const AddUserModal = (props) => {
  const newMemberRef = useRef();
  const dispatch = useDispatch();

  const addMemberHandler = (username) => {
    dispatch({ type: actionTypes.TEAM_ADD_MEMBER, username: username });
  };

  return (
    <Modal show={props.showModal} onHide={props.closeModalHandler}>
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
        <Button variant="secondary" onClick={props.closeModalHandler}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            addMemberHandler(newMemberRef.current.value);
            props.closeModalHandler();
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddUserModal;
