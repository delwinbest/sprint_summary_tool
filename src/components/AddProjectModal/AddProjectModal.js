import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Button, Modal, Col, Row, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as actionTypes from "../../store/actions/actionTypes";

const AddProjectModal = (props) => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects);
  const schema = yup.object().shape({
    projectName: yup
      .string()
      .min(3, "Should be 3 or more chars")
      .required("Please enter a project name"),
  });

  const onSubmitHandler = (event) => {
    console.log(event);
    dispatch({
      type: actionTypes.PROJECT_ADD,
      projectName: event.projectName,
      active: true,
      projectType: event.projectType,
    });
    props.closeModalHandler();
  };
  const toTitles = (s) => {
    const title = s.replace(props.classification + "_", "");
    return title.replace(/\w\S*/g, function (t) {
      return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
    });
  };
  let projectTypes = {};
  Object.keys(projects)
    .filter((project) =>
      projects[project].type.startsWith(props.classification)
    )
    .forEach((project) => {
      projectTypes[projects[project].type] = {
        label: toTitles(projects[project].type),
      };
    });

  const projectTypeSelector = Object.keys(projectTypes).map((projectype) => {
    return (
      <option value={projectype} label={projectTypes[projectype].label}>
        {projectTypes[projectype].label}
      </option>
    );
  });

  return (
    <Modal show={props.showModal} onHide={props.closeModalHandler}>
      <Modal.Header closeButton>
        <Modal.Title>Add New {props.classification}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={schema}
          onSubmit={onSubmitHandler}
          initialValues={{
            projectName: "",
            projectType: Object.keys(projectTypes)[0],
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
                <Form.Label column sm="4">
                  Project Name
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    name="projectName"
                    placeholder="Please enter sprint name"
                    value={values.projectName}
                    onChange={handleChange}
                    isInvalid={!!errors.projectName}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {errors.projectName}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="4">
                  Project Type
                </Form.Label>
                <div className="col-sm-8">
                  <select
                    className="form-control"
                    name="projectType"
                    value={values.projectType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ display: "block" }}
                  >
                    {projectTypeSelector}
                  </select>
                </div>
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

export default AddProjectModal;
