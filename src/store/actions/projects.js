import * as actionTypes from "./actionTypes";

export const addProject = (projectName, active, projectType) => {
  return {
    type: actionTypes.PROJECT_ADD,
    projectName: projectName,
    active: active,
    projectType: projectType,
  };
};
