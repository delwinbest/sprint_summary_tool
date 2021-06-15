import * as actionTypes from "../actions/actionTypes";

const initialState = {
  2021: {
    W01: {},
  },
};

const addSprint = (state, action) => {
  return {
    ...state,
    [action.year]: {
      ...state[action.year],
      [action.weekNum]: {
        name: action.name,
        members: [],
        startDate: action.startDate,
        sprintDurationDays: action.sprintDurationDays,
      },
    },
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SPRINT_ADD:
      return addSprint(state, action);
    default:
      return state;
  }
};

export default reducer;
