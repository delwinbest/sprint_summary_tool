import React, { useRef } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Button, Modal, Col, Row, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";

const AddSprintModal = (props) => {
  const dispatch = useDispatch();
  const sprintDurationRef = useRef();

  const schema = yup.object().shape({
    sprintName: yup
      .string()
      .min(3, "Should be 3 or more chars")
      .required("Please enter a sprint name"),
    sprintStartDate: yup.date().required("Please enter valid date"),
  });

  const onSubmitHandler = (event) => {
    const date = new Date(event.sprintStartDate);
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
    const weekNum = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
    let weekNumText = "W";
    if (weekNum < 10) {
      weekNumText = "W0" + weekNum.toString();
    } else {
      weekNumText = "W" + weekNum.toString();
    }
    //const addSprint = (weekNum, name, startDate, sprintDurationDays)
    dispatch({
      type: actionTypes.SPRINT_ADD,
      year: date.getFullYear(),
      weekNum: weekNumText,
      name: event.sprintName,
      startDate: event.sprintStartDate,
      sprintDurationDays: sprintDurationRef.current.value,
    });
    props.closeModalHandler();
  };

  return (
    <Modal show={props.showModal} onHide={props.closeModalHandler}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Sprint</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={schema}
          onSubmit={onSubmitHandler}
          initialValues={{
            sprintName: "",
            sprintStartDate: "",
            sprintDuration: "10",
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group as={Row} controlId="validationFormik101">
                <Form.Label column sm="3">
                  Sprint Name
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="text"
                    name="sprintName"
                    placeholder="Please enter sprint name"
                    value={values.sprintName}
                    onChange={handleChange}
                    isInvalid={!!errors.sprintName}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.sprintName}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="validationFormik102">
                <Form.Label column sm="3">
                  Start Date
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="date"
                    name="sprintStartDate"
                    onChange={handleChange}
                    isInvalid={!!errors.sprintStartDate}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.sprintStartDate}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group controlId="formBasicRange">
                <Form.Label>
                  Sprint Duration:
                  {sprintDurationRef.current
                    ? sprintDurationRef.current.value
                    : "10"}
                </Form.Label>
                <Form.Control
                  ref={sprintDurationRef}
                  type="range"
                  name="sprintDuration"
                  min="5"
                  max="14"
                  onChange={handleChange}
                />
              </Form.Group>

              <br />
              <Button type="submit" block>
                Add
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddSprintModal;
