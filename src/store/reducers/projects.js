import * as actionTypes from "../actions/actionTypes";
import * as projectTypes from "../actions/projectTypes";

const initialState = {
  KTLO: {
    type: projectTypes.NON_PROJECT_TEAM,
    active: true,
  },
  OE: {
    type: projectTypes.NON_PROJECT_TEAM,
    active: true,
  },
  Meeting: {
    type: projectTypes.NON_PROJECT_MEETING,
    active: true,
  },
  OnCall: {
    type: projectTypes.NON_PROJECT_ONCALL,
    active: true,
  },
  Interview: {
    type: projectTypes.NON_PROJECT_INTERVIEW,
    active: true,
  },
  LINE: {
    type: projectTypes.PROJECT_BUSINESS,
    active: true,
  },
  MAPPS: {
    type: projectTypes.PROJECT_BUSINESS,
    active: true,
  },
  MSS: {
    type: projectTypes.PROJECT_BUSINESS,
    active: true,
  },
  OOTO: {
    type: projectTypes.OOTO,
    active: true,
  },
  Holidays: {
    type: projectTypes.OOTO_HOLIDAY,
    active: true,
  },
};

const addProject = (state, action) => {
  return {
    ...state,
    [action.projectName]: {
      active: action.active,
      type: action.projectType,
    },
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PROJECT_ADD:
      return addProject(state, action);
    default:
      return state;
  }
};

export default reducer;
