import React from "react";
// material-ui components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-pro-react/modalStyle.js";

const useStyles = makeStyles(styles);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ErrorModal = (errors, clearErrors) => {
  const classes = useStyles();
  const errorModal = (
    <Dialog
      classes={{
        root: classes.center,
        paper: classes.modal,
      }}
      open={errors !== null}
      transition={Transition}
      keepMounted
      onClose={() => clearErrors()}
      aria-labelledby="modal-slide-title"
      aria-describedby="modal-slide-description"
    >
      <DialogTitle
        id="classic-modal-slide-title"
        disableTypography
        className={classes.modalHeader}
      >
        <Button
          justIcon
          className={classes.modalCloseButton}
          key="close"
          aria-label="Close"
          color="transparent"
          onClick={() => clearErrors()}
        >
          <Close className={classes.modalClose} />
        </Button>
        <h4 className={classes.modalTitle}>Error</h4>
      </DialogTitle>
      <DialogContent id="modal-slide-description" className={classes.modalBody}>
        {errors}
      </DialogContent>
      <DialogActions
        className={classes.modalFooter + " " + classes.modalFooterCenter}
      >
        <Button onClick={() => clearErrors()} color="success">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
  return { errorModal };
};

export default ErrorModal;
