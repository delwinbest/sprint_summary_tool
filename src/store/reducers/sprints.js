import * as actionTypes from "../actions/actionTypes";

const initialState = {
  2021: {
    W01: {
      name: "Sprint 01",
      members: [],
      startDate: "2021-01-01",
      sprintDurationDays: 10,
    },
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

const addSprintMembers = (state, action) => {
  return {
    ...state,
    [action.year]: {
      ...state[action.year],
      [action.weekNum]: {
        ...state[action.year][action.weekNum],
        members: action.members.sort(),
      },
    },
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SPRINT_ADD:
      return addSprint(state, action);
    case actionTypes.SPRINT_ADD_MEMBERS:
      return addSprintMembers(state, action);
    default:
      return state;
  }
};

export default reducer;
