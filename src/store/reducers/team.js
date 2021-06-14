import * as actionTypes from "../actions/actionTypes";

const initialState = {
  teamMembers: ["dbest", "grattanj"],
};

const addMember = (state, action) => {
  const teamMembers = state.teamMembers
    .filter((employee) => employee !== action.username)
    .map((employee) => {
      return employee;
    });
  return {
    ...state,
    teamMembers: [...teamMembers, action.username],
  };
};

const removeMember = (state, action) => {
  const teamMembers = state.teamMembers
    .filter((employee) => employee !== action.username)
    .map((employee) => {
      return employee;
    });
  return {
    ...state,
    teamMembers: teamMembers,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TEAM_ADD_MEMBER:
      return addMember(state, action);
    case actionTypes.TEAM_REMOVE_MEMBER:
      return removeMember(state, action);
    default:
      return state;
  }
};

export default reducer;
