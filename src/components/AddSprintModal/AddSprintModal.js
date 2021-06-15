import React, { useRef, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Button, Modal, Col, Row, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";

const AddSprintModal = (props) => {
  const newMemberRef = useRef();

  const schema = yup.object().shape({
    sprintName: yup
      .string()
      .min(3, "Should be 3 or more chars")
      .required("Please enter a sprint name"),
    sprintStartDate: yup.date().required("Please enter valid date"),
  });

  const [startDate, setStartDate] = useState(new Date());
  return (
    <Modal show={true} onHide={props.closeModalHandler}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Sprint</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={schema}
          onSubmit={console.log}
          initialValues={{
            sprintName: "",
            sprintStartDate: "",
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
              <Form.Row lg="2">
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationFormik101"
                >
                  <Form.Label column sm="2">
                    Sprint Name
                  </Form.Label>
                  <Col sm="10">
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

                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="validationFormik102"
                >
                  <Form.Label column sm="2">
                    Start Date
                  </Form.Label>
                  <Col sm="10">
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
              </Form.Row>
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
