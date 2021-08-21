import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

// material-ui components
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";

const useStyles = makeStyles(styles);

const ErrorModal = (errors, clearErrors = () => {}) => {
  const classes = useStyles();
  return errors ? (
    <SweetAlert
      error
      style={{ display: "block", marginTop: "-100px" }}
      title="Error!"
      onConfirm={() => clearErrors()}
      onCancel={() => clearErrors()}
      confirmBtnCssClass={classes.button + " " + classes.success}
    >
      {errors}
    </SweetAlert>
  ) : null;
};

export default ErrorModal;
