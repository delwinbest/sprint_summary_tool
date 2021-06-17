import React from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { Button, Modal, Col, Row, Form } from "react-bootstrap";
import { FloatingLabel } from "bootstrap";
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
    projectType: yup.string().required("Please enter a project type"),
  });

  const onSubmitHandler = (event) => {
    dispatch({
      type: actionTypes.PROJECT_ADD,
      projectName: event.projectName,
      active: true,
      projectType: event.projectType,
    });
    props.closeModalHandler();
  };
  const toTitles = (s) => {
    const title = s.replace("NON_PROJECT_", "");
    return title.replace(/\w\S*/g, function (t) {
      return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
    });
  };
  let projectTypes = {};
  projectTypes = Object.keys(projects).map((project) => {
    const REMOVE = "NON_PROJECT_";
    console.log(projects[project].type);
    if (projectTypes[projects[project].type]) {
      return null;
    } else {
      return {
        name: projects[project].type,
        label: toTitles(projects[project].type),
      };
    }
  });

  console.log(projectTypes);
  const projectTypeSelector = (
    <Col>
      <Form.Check
        type="radio"
        label="second radio"
        name="formHorizontalRadios"
        id="formHorizontalRadios2"
      />
    </Col>
  );

  return (
    <Modal show={true} onHide={props.closeModalHandler}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={schema}
          onSubmit={onSubmitHandler}
          initialValues={{
            projectName: "",
            projectType: "",
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
              <fieldset>
                <Form.Group as={Row} className="mb-1">
                  {projectTypeSelector}
                </Form.Group>
              </fieldset>
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
