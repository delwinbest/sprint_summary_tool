import * as actionTypes from "../actions/actionTypes";

const initialState = {
  teamMembers: ["dbest", "grattanj"],
};

const addMember = (state, action) => {
  return {
    ...state,
    teamMembers: [...state.teamMembers, action.username],
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TEAM_ADD_MEMBER:
      return addMember(state, action);
    default:
      return state;
  }
};

export default reducer;
