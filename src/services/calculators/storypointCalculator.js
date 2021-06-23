export const calculateTotalSprintStoryTotal = (sprintData) => {
  // This takes a sprint data object and returns the totals for stories and points planned + completed.

  // Get the sprint storydata
  const storyData = sprintData.storyData;

  //Story in this object
  const storyPointTotals = {};

  // In the data we have project_name > MANY storyDataAttrib > Value, lets build this dynamicaly.
  Object.keys(storyData).forEach((project) => {
    Object.keys(storyData[project]).forEach((storyAttrib) => {
      if (storyPointTotals[storyAttrib] !== undefined) {
        storyPointTotals[storyAttrib] += +storyData[project][storyAttrib];
      } else {
        storyPointTotals[storyAttrib] = +storyData[project][storyAttrib];
      }
    });
  });
  return { ...storyPointTotals };
};
