import * as actionTypes from "./actionTypes";

export const addMember = (username) => {
  return {
    type: actionTypes.TEAM_ADD_MEMBER,
    username: username,
  };
};

export const removeMember = (username) => {
  return {
    type: actionTypes.TEAM_REMOVE_MEMBER,
    username: username,
  };
};
