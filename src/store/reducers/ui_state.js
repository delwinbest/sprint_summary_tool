import * as actionTypes from "../actions/actionTypes";

const initialState = {
  selectedSprint: {
    year: "",
    weekNum: "",
  },
};

const updateSelectedSprintYear = (state, action) => {
  return {
    ...state,
    selectedSprint: {
      ...state.selectedSprint,
      year: action.year,
    },
  };
};

const updateSelectedSprintWeek = (state, action) => {
  return {
    ...state,
    selectedSprint: {
      ...state.selectedSprint,
      weekNum: action.weekNum,
    },
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STATE_UPDATE_SELECTED_SPRINT_YEAR:
      return updateSelectedSprintYear(state, action);
    case actionTypes.STATE_UPDATE_SELECTED_SPRINT_WEEK:
      return updateSelectedSprintWeek(state, action);
    default:
      return state;
  }
};

export default reducer;
