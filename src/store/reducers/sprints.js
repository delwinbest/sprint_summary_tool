import * as actionTypes from "../actions/actionTypes";

const initialState = {
  2021: {
    W01: {
      name: "Sprint 01",
      members: [],
      startDate: "2021-01-01",
      sprintDurationDays: 10,
      projects: [],
      capacity: {},
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
        capacity: action.capacity,
      },
    },
  };
};

const addSprintProjects = (state, action) => {
  return {
    ...state,
    [action.year]: {
      ...state[action.year],
      [action.weekNum]: {
        ...state[action.year][action.weekNum],
        projects: action.projects.sort(),
      },
    },
  };
};

const addSprintCapacity = (state, action) => {
  return {
    ...state,
    [action.year]: {
      ...state[action.year],
      [action.weekNum]: {
        ...state[action.year][action.weekNum],
        capacity: {
          ...state[action.year][action.weekNum].capacity,
          [action.employee]: {
            ...state[action.year][action.weekNum].capacity[action.employee],
            [action.project]: action.days,
          },
        },
      },
    },
  };
};

const removeSprintCapacity = (state, action) => {
  // We get the project only and want to remove this attribute from the users array.
  const employeeCapacity = {
    ...state[action.year][action.weekNum].capacity[action.employee],
  };
  console.log(employeeCapacity);
  console.log(action.project);
  const newCapacity = {};
  Object.keys(employeeCapacity)
    .filter((project) => project !== action.project)
    .forEach((project) => {
      newCapacity[project] = employeeCapacity[project];
    });
  return {
    ...state,
    [action.year]: {
      ...state[action.year],
      [action.weekNum]: {
        ...state[action.year][action.weekNum],
        capacity: {
          ...state[action.year][action.weekNum].capacity,
          [action.employee]: { ...newCapacity },
        },
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
    case actionTypes.SPRINT_ADD_PROJECTS:
      return addSprintProjects(state, action);
    case actionTypes.SPRINT_ADD_CAPACITY:
      return addSprintCapacity(state, action);
    case actionTypes.SPRINT_REMOVE_CAPACITY:
      return removeSprintCapacity(state, action);
    default:
      return state;
  }
};

export default reducer;
