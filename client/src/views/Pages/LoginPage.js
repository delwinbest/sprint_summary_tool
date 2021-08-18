import React from "react";
import { useHistory } from "react-router-dom";
import GoogleLogin from "react-google-login";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
// import LockOutline from "@material-ui/icons/LockOutline";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";

import useRequest from "../../hooks/useRequest";
import ErrorModal from "../../components/ErrorModal/ErrorModal";
import { useAppDispatch } from "store";
import { authActions } from "store/auth-slice";

const useStyles = makeStyles(styles);

export default function LoginPage() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const intialValues = { email: "", password: "" };
  const [formValues, setFormValues] = React.useState(intialValues);
  const [formErrors, setFormErrors] = React.useState({ error: true });

  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const { doRequest, clearErrors, errors } = useRequest({
    url: "/api/users/signin",
    method: "POST",
    body: { ...formValues },
    onSuccess: (responseData) => {
      const { email, id, name } = responseData;
      dispatch(authActions.login({ email, id, name }));
      history.push("/admin");
    },
  });
  const { errorModal } = ErrorModal(errors, clearErrors);
  React.useEffect(() => {
    let id = setTimeout(function () {
      setCardAnimation("");
    }, 700);
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.clearTimeout(id);
    };
  });
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
    return errors;
  };

  return (
    <div className={classes.container}>
      {errorModal}
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form onSubmit={(e) => onSubmit(e)}>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="rose"
              >
                <h4 className={classes.cardTitle}>Log in</h4>
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENTID}
                  buttonText="Log in with Google"
                  render={(renderProps) => (
                    <div className={classes.socialLine}>
                      <Button
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        color="transparent"
                        justIcon
                        className={classes.customButtonClass}
                      >
                        <i className="fab fa-google" />
                      </Button>
                    </div>
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
                {/* <div className={classes.socialLine}>
                  {[
                    "fab fa-facebook-square",
                    "fab fa-twitter",
                    "fab fa-google",
                  ].map((prop, key) => {
                    return (
                      <Button
                        color="transparent"
                        justIcon
                        key={key}
                        className={classes.customButtonClass}
                      >
                        <i className={prop} />
                      </Button>
                    );
                  })}
                </div> */}
              </CardHeader>
              <CardBody>
                <CustomInput
                  labelText="Email..."
                  id="email"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    value: formValues.email,
                    ...(formErrors.email && { error: true }),
                    onChange: (e) => onChange(e),
                  }}
                />
                <CustomInput
                  labelText="Password"
                  id="password"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className={classes.inputAdornmentIcon}>
                          lock_outline
                        </Icon>
                      </InputAdornment>
                    ),
                    type: "password",
                    autoComplete: "off",
                    value: formValues.password,
                    ...(formErrors.password && { error: true }),
                    onChange: (e) => onChange(e),
                  }}
                />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button
                  color="rose"
                  simple
                  size="lg"
                  block
                  type="submit"
                  {...(Object.keys(formErrors).length !== 0 && {
                    disabled: true,
                  })}
                >
                  Let{"'"}s Go
                </Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
