import * as actionTypes from "./actionTypes";

export const addSprint = (
  year,
  weekNum,
  name,
  startDate,
  sprintDurationDays
) => {
  return {
    type: actionTypes.SPRINT_ADD,
    year: year,
    weekNum: weekNum,
    name: name,
    startDate: startDate,
    sprintDurationDays: sprintDurationDays,
  };
};

export const addSprintMembers = (year, weekNum, members) => {
  return {
    type: actionTypes.SPRINT_ADD_MEMBERS,
    year: year,
    weekNum: weekNum,
    members: members,
  };
};
