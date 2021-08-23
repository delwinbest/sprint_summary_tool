import React from "react";
import { useSelector } from "react-redux";
// @material-ui/icons
import Face from "@material-ui/icons/Face";
import RecordVoiceOver from "@material-ui/icons/RecordVoiceOver";
import Email from "@material-ui/icons/Email";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import PictureUpload from "components/CustomUpload/PictureUpload.js";
import CustomInput from "components/CustomInput/CustomInput.js";

const styles = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center",
  },
  inputAdornmentIcon: {
    color: "#555",
  },
  inputAdornment: {
    position: "relative",
  },
};

const useStyles = makeStyles(styles);

const Step1 = React.forwardRef((props, ref) => {
  const { name: loggedInName, email: loggedInEmail } = useSelector(
    (state) => state.user
  );
  const classes = useStyles();
  const [name, setName] = React.useState("");
  const [nameState, setNameState] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [emailState, setEmailState] = React.useState("");

  React.useEffect(() => {
    setName(loggedInName);
    setNameState("success");
    setEmail(loggedInEmail);
    setEmailState("success");
    return () => {};
  }, []);

  React.useImperativeHandle(ref, () => ({
    isValidated: () => {
      return isValidated();
    },
    sendState: () => {
      return sendState();
    },
    state: {
      name,
      nameState,
      email,
      emailState,
    },
  }));
  const sendState = () => {
    return {
      name,
      nameState,
      email,
      emailState,
    };
  };
  // function that returns true if value is email, false otherwise
  const verifyEmail = (value) => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  // function that verifies if a string has a given length or not
  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };
  const isValidated = () => {
    if (nameState === "success" && emailState === "success") {
      return true;
    } else {
      if (nameState !== "success") {
        setNameState("error");
      }
      if (emailState !== "success") {
        setEmailState("error");
      }
    }
    return false;
  };
  return (
    <GridContainer justify="center">
      <GridItem xs={12} sm={12}>
        <h4 className={classes.infoText}>
          Let{"'"}s start with the basic information
        </h4>
      </GridItem>
      <GridItem xs={12} sm={4}>
        <PictureUpload />
      </GridItem>
      <GridItem xs={12} sm={6}>
        <CustomInput
          success={nameState === "success"}
          error={nameState === "error"}
          labelText={
            <span>
              Name <small>(required)</small>
            </span>
          }
          id="name"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            value: name,
            onChange: (event) => {
              if (!verifyLength(event.target.value, 3)) {
                setNameState("error");
              } else {
                setNameState("success");
              }
              setName(event.target.value);
            },
            endAdornment: (
              <InputAdornment position="end" className={classes.inputAdornment}>
                <Face className={classes.inputAdornmentIcon} />
              </InputAdornment>
            ),
          }}
        />
      </GridItem>
      <GridItem xs={12} sm={12} md={12} lg={10}>
        <CustomInput
          success={emailState === "success"}
          error={emailState === "error"}
          labelText={
            <span>
              Email <small>(required)</small>
            </span>
          }
          id="email"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            value: email,
            onChange: (event) => {
              if (!verifyEmail(event.target.value)) {
                setEmailState("error");
              } else {
                setEmailState("success");
              }
              setEmail(event.target.value);
            },
            endAdornment: (
              <InputAdornment position="end" className={classes.inputAdornment}>
                <Email className={classes.inputAdornmentIcon} />
              </InputAdornment>
            ),
          }}
        />
      </GridItem>
    </GridContainer>
  );
});

Step1.displayName = "Step1";

export default Step1;
