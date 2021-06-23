import * as actionTypes from "../actions/actionTypes";

const initialState = {};

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
        projects: [],
        capacity: {},
        storyData: {},
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
  // Expect [PROJECT1, PROJECT2, PROJECT3], we want to merge the stories
  const allProjects = Object.keys(action.projects);
  const businessProjects = Object.keys(action.projects)
    .filter(
      (project) =>
        action.projects[project].type.startsWith("PROJECT") &&
        action.projects[project].active === true
    )
    .sort();
  const storyDataTemplate = {
    tasksPlanned: 0,
    tasksCompleted: 0,
    pointsPlanned: 0,
    pointsCompleted: 0,
  };
  const existingSprintStoryData = state[action.year][action.weekNum].storyData;
  const updatedSprintStoryData = {};
  businessProjects.forEach((project) => {
    if (existingSprintStoryData[project] !== undefined) {
      updatedSprintStoryData[project] = existingSprintStoryData[project];
    } else {
      updatedSprintStoryData[project] = storyDataTemplate;
    }
  });
  // businessProjects.forEach((project) => {
  //   updatedSprintStoryData[project] = storyDataTemplate;
  // });

  return {
    ...state,
    [action.year]: {
      ...state[action.year],
      [action.weekNum]: {
        ...state[action.year][action.weekNum],
        projects: allProjects,
        storyData: updatedSprintStoryData,
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

const addSprintStoryData = (state, action) => {
  // Expect year, weekNum, project, dataType, data
  return {
    ...state,
    [action.year]: {
      ...state[action.year],
      [action.weekNum]: {
        ...state[action.year][action.weekNum],
        storyData: {
          ...state[action.year][action.weekNum].storyData,
          [action.project]: {
            ...state[action.year][action.weekNum].storyData[action.project],
            [action.dataType]: action.data,
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
    case actionTypes.SPRINT_ADD_STORY_DATA:
      return addSprintStoryData(state, action);
    default:
      return state;
  }
};

export default reducer;
