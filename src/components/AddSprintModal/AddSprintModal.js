import React, { useRef, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Modal, Col, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";

const AddSprintModal = (props) => {
  const newMemberRef = useRef();

  const schema = yup.object().shape({
    sprintName: yup
      .string()
      .min(3, "Should be 3 or more chars")
      .required("Please enter a sprint name"),
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
              <Form.Row>
                <Form.Group as={Col} md="9" controlId="validationFormik101">
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
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </Form.Group>
              </Form.Row>
              <br />
              <Button type="submit" style={{ justifySelf: "flex-end" }} block>
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
