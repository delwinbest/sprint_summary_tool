import React from "react";

import "./sass/index.scss";
import { useSelector, useDispatch } from "react-redux";
import * as actionTypes from "./store/actions/actionTypes";

function App() {
  const dispatch = useDispatch();
  const team = useSelector((state) => state.team);

  const addMemberHandler = (username) => {
    dispatch({ type: actionTypes.TEAM_ADD_MEMBER, username: "DDDDD" });
  };

  const removeMemberHandler = (username) => {
    dispatch({ type: actionTypes.TEAM_REMOVE_MEMBER, username: username });
  };

  const teamList = team.teamMembers.map((employee) => {
    return <div onClick={() => removeMemberHandler(employee)}>{employee}</div>;
  });

  return (
    <React.Fragment>
      <div className="bg__header"></div>
      <div className="mainview-container">
        <header className="header"></header>
        <div className="maincontent">
          <div className="card" style={{ width: "20rem" }}>
            <h2>Team Members</h2>
            {teamList}
            <button onClick={addMemberHandler}>Click Me</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
