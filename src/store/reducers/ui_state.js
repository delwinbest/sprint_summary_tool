import * as actionTypes from "../actions/actionTypes";

const initialState = {
  selectedSprint: {
    year: "2021",
    weekNum: "W01",
  },
};

const updateSelectedSprint = (state, action) => {
  return {
    ...state,
    selectedSprint: {
      year: action.year,
      weekNum: action.weekNum,
    },
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STATE_UPDATE_SELECTED_SPRINT:
      return updateSelectedSprint(state, action);
    default:
      return state;
  }
};

export default reducer;
