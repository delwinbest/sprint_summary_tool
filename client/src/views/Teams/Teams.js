import React from "react";
import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Add from "@material-ui/icons/Add";

// core components
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
import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import useRequest from "hooks/useRequest";

const useStyles = makeStyles(styles);

export default function TeamsPage() {
  const classes = useStyles();
  const [errors, setErrors] = React.useState(null);
  const [teams, setTeams] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [popup, setPopup] = React.useState(null);

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

  const errorModal = ErrorModal(errors, () => {
    setErrors(null);
  });
  React.useEffect(async () => {
    setLoading(true);
    refreshTeams();
    return () => {};
  }, []);

  const fillButtons = [
    { color: "info", icon: Person },
    { color: "success", icon: Edit },
    { color: "danger", icon: Close },
  ].map((prop, key) => {
    return (
      <Button color={prop.color} className={classes.actionButton} key={key}>
        <prop.icon className={classes.icon} />
      </Button>
    );
  });

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

  const handleAddTeam = async (e) => {
    addTeamRequest({ body: { name: e } });
    clearPopup();
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
                    <Button color="success" className={classes.actionButton}>
                      <Add className={classes.Add} onClick={addTeamPopup} />
                    </Button>,
                  ]}
                  tableData={teams.map((team) => {
                    return [
                      "..." + team.team.id.slice(-5),
                      team.team.name,
                      team.members.length,
                      fillButtons,
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
      </GridContainer>
    </div>
  );
}
