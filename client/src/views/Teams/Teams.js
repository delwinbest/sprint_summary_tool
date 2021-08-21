import React, { useEffect, useState } from "react";
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

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import useRequest from "hooks/useRequest";

const useStyles = makeStyles(styles);

export default function TeamsPage() {
  const classes = useStyles();
  const [teams, setTeams] = useState([]);
  const { doRequest } = useRequest({
    url: "/api/teams",
    method: "GET",
    body: {},
    onSuccess: (returnData) => setTeams(returnData),
  });
  useEffect(async () => {
    doRequest();
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

  return (
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
            <Table
              tableHead={[
                "ID",
                "Team Name",
                "Members",
                <Button color="success" className={classes.actionButton}>
                  <Add className={classes.Add} />
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
              customCellClasses={[classes.center, classes.right, classes.right]}
              customClassesForCells={[0, 4, 5]}
              customHeadCellClasses={[
                classes.center,
                classes.right,
                classes.right,
              ]}
              customHeadClassesForCells={[0, 4, 5]}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
