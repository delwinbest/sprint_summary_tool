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
