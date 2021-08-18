import React from "react";
import { useHistory } from "react-router-dom";
import GoogleLogin from "react-google-login";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Timeline from "@material-ui/icons/Timeline";
import Code from "@material-ui/icons/Code";
import Group from "@material-ui/icons/Group";
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";
import Check from "@material-ui/icons/Check";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InfoArea from "components/InfoArea/InfoArea.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/registerPageStyle";

import useRequest from "../../hooks/useRequest";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import { useAppDispatch } from "store";
import { authActions } from "store/auth-slice";

const useStyles = makeStyles(styles);

export default function RegisterPage() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const intialValues = { email: "", password: "", name: "" };
  const [formValues, setFormValues] = React.useState(intialValues);
  const [formErrors, setFormErrors] = React.useState({ error: true });
  const [checked, setChecked] = React.useState([]);
  const { doRequest, clearErrors, errors } = useRequest({
    url: "/api/users/signup",
    method: "POST",
    body: { ...formValues },
    onSuccess: (responseData) => {
      const { email, id, name } = responseData;
      dispatch(authActions.login({ email, id, name }));
      history.push("/admin");
    },
  });
  const { errorModal } = ErrorModal(errors, clearErrors);
  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const classes = useStyles();

  const onSubmit = async (event) => {
    event.preventDefault();
    doRequest();
  };

  const onChange = (e) => {
    const { id, value } = e.target;
    const newFormValues = { ...formValues, [id]: value };
    setFormValues(newFormValues);
    const validationErrors = validate(newFormValues);
    setFormErrors(validationErrors);
  };

  const validate = (values) => {
    let errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = "Cannot be blank";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email format";
    }
    if (!values.password) {
      errors.password = "Cannot be blank";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    }
    if (!values.name) {
      errors.name = "Cannot be blank";
    } else if (values.name.length < 4) {
      errors.name = "Name must be more than 4 characters";
    }
    return errors;
  };

  return (
    <div className={classes.container}>
      {errorModal}
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={10}>
          <Card className={classes.cardSignup}>
            <h2 className={classes.cardTitle}>Register</h2>
            <CardBody>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={5}>
                  <InfoArea
                    title="Track and Trend"
                    description="Tack your team's progress and ability to deliver acurately based on past sprint planning metrics."
                    icon={Timeline}
                    iconColor="rose"
                  />
                  <InfoArea
                    title="Open Source Microservice Design"
                    description="If you like it, give back by making the tool better!"
                    icon={Code}
                    iconColor="primary"
                  />
                  <InfoArea
                    title="Built With Teams in Mind"
                    description="Designed our how you think about your day and plan your week."
                    icon={Group}
                    iconColor="info"
                  />
                </GridItem>
                <GridItem xs={12} sm={8} md={5}>
                  <div className={classes.center}>
                    <GoogleLogin
                      clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENTID}
                      buttonText="Sign up with Google"
                      render={(renderProps) => (
                        <Button
                          justIcon
                          round
                          color="google"
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                        >
                          <i className="fab fa-google" />
                        </Button>
                      )}
                      onSuccess={(googleData) =>
                        doRequest({
                          url: "/api/users/googleauth",
                          body: {
                            token: googleData.tokenId,
                          },
                        })
                      }
                      onFailure={(error) => {
                        console.log(error);
                      }}
                      cookiePolicy={"single_host_origin"}
                    />

                    {` `}
                    <h4 className={classes.socialTitle}>or be classical</h4>
                  </div>
                  <form className={classes.form} onSubmit={(e) => onSubmit(e)}>
                    <CustomInput
                      id="name"
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                      }}
                      inputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className={classes.inputAdornment}
                          >
                            <Face className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        ),
                        placeholder: "Name...",
                        value: formValues.name,
                        ...(formErrors.name && { error: true }),
                        onChange: (e) => onChange(e),
                      }}
                    />
                    <CustomInput
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                      }}
                      inputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className={classes.inputAdornment}
                          >
                            <Email className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        ),
                        placeholder: "Email...",
                        value: formValues.email,
                        ...(formErrors.email && { error: true }),
                        onChange: (e) => onChange(e),
                      }}
                    />
                    <CustomInput
                      id="password"
                      formControlProps={{
                        fullWidth: true,
                        className: classes.customFormControlClasses,
                      }}
                      inputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            className={classes.inputAdornment}
                          >
                            <Icon className={classes.inputAdornmentIcon}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        placeholder: "Password...",
                        value: formValues.password,
                        ...(formErrors.password && { error: true }),
                        onChange: (e) => onChange(e),
                      }}
                    />
                    <FormControlLabel
                      classes={{
                        root: classes.checkboxLabelControl,
                        label: classes.checkboxLabel,
                      }}
                      control={
                        <Checkbox
                          tabIndex={-1}
                          onClick={() => handleToggle(1)}
                          checkedIcon={
                            <Check className={classes.checkedIcon} />
                          }
                          icon={<Check className={classes.uncheckedIcon} />}
                          classes={{
                            checked: classes.checked,
                            root: classes.checkRoot,
                          }}
                        />
                      }
                      label={
                        <span>
                          I agree to the{" "}
                          <a href="#pablo">terms and conditions</a>.
                        </span>
                      }
                    />
                    <div className={classes.center}>
                      <Button
                        round
                        color="primary"
                        type="submit"
                        {...(Object.keys(formErrors).length !== 0 && {
                          disabled: true,
                        })}
                      >
                        Get started
                      </Button>
                    </div>
                    <div className={classes.center}>
                      <a href="/auth/login-page">Or Sign In</a>
                    </div>
                  </form>
                </GridItem>
              </GridContainer>
              {errors}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
