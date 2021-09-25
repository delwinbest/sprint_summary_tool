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
const useStyles = makeStyles(styles);

export default function UsersPage() {
  const classes = useStyles();
  const { name: userName, id: userId } = useSelector((state) => state.user);
  const [errors, setErrors] = React.useState(null);
  const [teams, setTeams] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [popup, setPopup] = React.useState(null);
  const [activeTeam, setActiveTeam] = React.useState(null);
  const [activeTeamArchived, setActiveTeamArchived] = React.useState(null);

  const { doRequest: refreshTeams } = useRequest({
    url: "/api/teams",
    method: "GET",
    body: {},
    onSuccess: (returnData) => {
      setTeams(returnData);
      setLoading(false);
    },
    onFailure: (errorText) => {
      setErrors(errorText);
    },
  });
  const { doRequest: addTeamRequest } = useRequest({
    url: "/api/teams",
    method: "POST",
    body: {},
    onSuccess: () => {
      setLoading(true);
      refreshTeams();
    },
    onFailure: (errorText) => {
      setErrors(errorText);
    },
  });

  const { doRequest: getTeamRequest } = useRequest({
    url: "/api/teams",
    method: "GET",
    body: {},
    onSuccess: (returnedTeam) => {
      // TODO: Figure out what this does. Does not make sense to set team status on GET
      setActiveTeamArchived(returnedTeam.team.status === TeamStatus.Archived);
      setActiveTeam(returnedTeam.team);
    },
    onFailure: (errorText) => {
      setErrors(errorText);
    },
  });

  const { doRequest: addUserToTeamRequest } = useRequest({
    url: "/api/teams",
    method: "PUT",
    body: {},
    onSuccess: () => {
      setLoading(true);
      refreshTeams();
    },
    onFailure: (errorText) => {
      setErrors(errorText);
    },
  });

  const { doRequest: updateTeamRequest } = useRequest({
    url: "/api/teams",
    method: "PUT",
    body: {},
    onSuccess: () => {
      setActiveTeam(null);
      setActiveTeamArchived(null);
      setLoading(true);
      refreshTeams();
    },
    onFailure: (errorText) => {
      setErrors(errorText);
    },
  });

  const loadTeam = (teamId) => {
    getTeamRequest({ url: `/api/teams/${teamId}` });
  };

  const errorModal = ErrorModal(errors, () => {
    setErrors(null);
  });
  React.useEffect(async () => {
    setLoading(true);
    refreshTeams();
    return () => {};
  }, []);

  const fillButtons = (teamId, teamStatus) => {
    return [
      {
        color: "info",
        icon: PersonAdd,
        disabled: teamStatus !== TeamStatus.Active,
        onClick: () => {
          handleAddMeToTeam(teamId);
        },
      },
      {
        color: "success",
        icon: Edit,
        onClick: (e) => {
          loadTeam(teamId);
        },
      },
    ].map((prop, key) => {
      return (
        <Button
          color={prop.color}
          className={classes.actionButton}
          key={key}
          id={teamId}
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

  const addTeamPopup = () => {
    setPopup(
      <SweetAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="What is you team name?"
        onConfirm={(e) => {
          handleAddTeam(e);
        }}
        onCancel={() => clearPopup()}
        confirmBtnCssClass={classes.button + " " + classes.info}
        cancelBtnCssClass={classes.button + " " + classes.danger}
        validationMsg="Please enter a team name."
      />
    );
  };

  const handleAddMeToTeam = (teamId) => {
    setPopup(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => confirmAddMeToTeam(teamId)}
        onCancel={() => clearPopup()}
        confirmBtnCssClass={classes.button + " " + classes.success}
        cancelBtnCssClass={classes.button + " " + classes.danger}
        confirmBtnText="Yes, add me to this team!"
        cancelBtnText="Cancel"
        showCancel
      >
        You can only be a member of one team. This will remove you from your
        current team.
      </SweetAlert>
    );
  };

  const confirmAddMeToTeam = (teamId) => {
    addUserToTeamRequest({
      url: `/api/users/${userId}`,
      body: { teamId: teamId },
    });
    setPopup(
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Done!"
        onConfirm={() => clearPopup()}
        onCancel={() => clearPopup()}
        confirmBtnCssClass={classes.button + " " + classes.success}
      >
        Welcome to your new team!
      </SweetAlert>
    );
  };
  const handleAddTeam = async (e) => {
    addTeamRequest({ body: { name: e } });
    clearPopup();
  };

  const editTeamOnChange = (e) => {
    let team = activeTeam;
    team[e.target.id] = e.target.value;
    setActiveTeam(team);
  };

  const setTeamStatus = (isActive) => {
    let team = activeTeam;
    if (isActive) {
      setActiveTeamArchived(false);
      team.status = TeamStatus.Active;
    } else {
      setActiveTeamArchived(true);
      team.status = TeamStatus.Archived;
    }
    setActiveTeam(team);
  };

  const handleTeamUpdate = (e) => {
    e.preventDefault();
    updateTeamRequest({
      url: `/api/teams/${activeTeam.id}`,
      body: activeTeam,
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
              <h4 className={classes.cardIconTitle}>Your Teams</h4>
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
                  tableHead={[
                    "ID",
                    "Team Name",
                    "Members",
                    "Status",
                    <Button color="success" className={classes.actionButton}>
                      <Add className={classes.Add} onClick={addTeamPopup} />
                    </Button>,
                  ]}
                  tableData={teams.map((team) => {
                    return [
                      "..." + team.team.id.slice(-5),
                      team.team.name,
                      team.members.length,
                      team.team.status,
                      fillButtons(team.team.id, team.team.status),
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
        {activeTeam ? (
          <GridItem xs={12}>
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <EditIcon />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>
                  Edit Team:{" "}
                  {activeTeam
                    ? "[..." + activeTeam.id.slice(-5) + "] " + activeTeam.name
                    : null}
                </h4>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleTeamUpdate}>
                  <CustomInput
                    labelText="New team name"
                    id="name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "text",
                      placeholder: activeTeam ? activeTeam.name : null,
                      value: activeTeam ? activeTeam.name : "",
                      onChange: (e) => editTeamOnChange(e),
                    }}
                  />
                  <div className={classes.block}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!activeTeamArchived}
                          value={!activeTeamArchived}
                          onChange={(e) => setTeamStatus(e.target.checked)}
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
                      label={`Team status is ${activeTeam.status}`}
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
