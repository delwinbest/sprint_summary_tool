import * as actionTypes from "./actionTypes";

export const addProject = (projectName, projectDetail) => {
  return {
    type: actionTypes.PROJECT_ADD,
    projectName: projectName,
    projectDetail: projectDetail,
  };
};
