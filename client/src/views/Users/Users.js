import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
import EditIcon from "@material-ui/icons/Edit";
import PersonAdd from "@material-ui/icons/PersonAdd";
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";

// core components
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";

import ErrorModal from "../../components/ErrorModal/ErrorModal";
import useRequest from "hooks/useRequest";
import { TeamStatus } from "@sprintsummarytool/common/build/events/types/team-status";
import { useSelector } from "react-redux";

import styles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import { UserStatus } from "@sprintsummarytool/common/build/events/types/user-status";
const useStyles = makeStyles(styles);

export default function TeamsPage() {
  const classes = useStyles();
  const { name: userName, id: userId } = useSelector((state) => state.user);
  const [errors, setErrors] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [popup, setPopup] = React.useState(null);
  const [activeUser, setActiveUser] = React.useState(null);
  const [activeUserArchived, setActiveUserArchived] = React.useState(null);

  const { doRequest: refreshTeams } = useRequest({
    url: "/api/users",
    method: "GET",
    body: {},
    onSuccess: (returnData) => {
      setUsers(returnData);
      setLoading(false);
    },
    onFailure: (errorText) => {
      setErrors(errorText);
    },
  });

  const { doRequest: getUserRequest } = useRequest({
    url: "/api/users",
    method: "GET",
    body: {},
    onSuccess: (returnedUser) => {
      // setactiveUserArchived(returnedUser.team.status === TeamStatus.Archived);
      // setactiveUser(returnedUser.team);
    },
    onFailure: (errorText) => {
      setErrors(errorText);
    },
  });

  // const { doRequest: updateTeamRequest } = useRequest({
  //   url: "/api/teams",
  //   method: "PUT",
  //   body: {},
  //   onSuccess: () => {
  //     setactiveUser(null);
  //     setactiveUserArchived(null);
  //     setLoading(true);
  //     refreshTeams();
  //   },
  //   onFailure: (errorText) => {
  //     setErrors(errorText);
  //   },
  // });

  const loadUser = (userId) => {
    getUserRequest({ url: `/api/users/${userId}` });
  };

  const errorModal = ErrorModal(errors, () => {
    setErrors(null);
  });
  React.useEffect(async () => {
    setLoading(true);
    refreshTeams();
    return () => {};
  }, []);

  const fillButtons = (userId, teamStatus) => {
    return [
      {
        color: "success",
        icon: Edit,
        onClick: (e) => {
          loadUser(userId);
        },
      },
    ].map((prop, key) => {
      return (
        <Button
          color={prop.color}
          className={classes.actionButton}
          key={key}
          id={userId}
          disabled={prop.disabled}
          onClick={prop.onClick}
        >
          <prop.icon className={classes.icon} />
        </Button>
      );
    });
  };

  const clearPopup = () => {
    setPopup(null);
  };

  const editUserOnChange = (e) => {
    let user = activeUser;
    user[e.target.id] = e.target.value;
    setActiveUser(user);
  };

  const setUserStatus = (isActive) => {
    let user = activeUser;
    if (isActive) {
      setActiveUserArchived(false);
      user.status = UserStatus.Active;
    } else {
      setActiveUserArchived(true);
      user.status = UserStatus.Archived;
    }
    setActiveUser(user);
  };

  const handleUserUpdate = (e) => {
    e.preventDefault();
    updateUserRequest({
      url: `/api/users/${activeUser.id}`,
      body: activeUser,
    });
  };

  return (
    <div>
      {popup}
      {errorModal}
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <Assignment />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Users</h4>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div
                  className="divSpinner"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Fade
                    in={loading === true}
                    style={{
                      transitionDelay: loading === false ? "800ms" : "0ms",
                    }}
                    unmountOnExit
                  >
                    <CircularProgress />
                  </Fade>
                </div>
              ) : (
                <Table
                  tableHead={["ID", "User Name", "Role", "Status"]}
                  tableData={users.map((user) => {
                    return [
                      "..." + user.id.slice(-5),
                      user.name,
                      user.role,
                      user.status,
                      fillButtons(user.id, user.status),
                    ];
                  })}
                  customCellClasses={[
                    classes.center,
                    classes.right,
                    classes.right,
                  ]}
                  customClassesForCells={[0, 4, 5]}
                  customHeadCellClasses={[
                    classes.center,
                    classes.right,
                    classes.right,
                  ]}
                  customHeadClassesForCells={[0, 4, 5]}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
        {activeUser ? (
          <GridItem xs={12}>
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <EditIcon />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  Edit Team:{" "}
                  {activeUser
                    ? "[..." + activeUser.id.slice(-5) + "] " + activeUser.name
                    : null}
                </h4>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleUserUpdate}>
                  <CustomInput
                    labelText="New team name"
                    id="name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      placeholder: activeUser ? activeUser.name : null,
                      value: activeUser ? activeUser.name : "",
                      onChange: (e) => editTeamOnChange(e),
                    }}
                  />
                  <div className={classes.block}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!activeUserArchived}
                          value={!activeUserArchived}
                          onChange={(e) => setUserStatus(e.target.checked)}
                          classes={{
                            switchBase: classes.switchBase,
                            checked: classes.switchChecked,
                            thumb: classes.switchIcon,
                            track: classes.switchBar,
                          }}
                        />
                      }
                      classes={{
                        label: classes.label,
                      }}
                      label={`Team status is ${activeUser.status}`}
                    />
                  </div>

                  <Button color="rose" type="submit">
                    Update
                  </Button>
                </form>
              </CardBody>
            </Card>
          </GridItem>
        ) : null}
      </GridContainer>
    </div>
  );
}
