import * as services from "../index";

export const calculateVelocity = (points, days) => {
  // Probably doesnt warrant its own function, but here goes.
  // I expect points and number of days. I will return the velocity metrics.

  // Velocity is number of points completed per day;
  return (+points / +days).toFixed(2);
};

export const calculateVelocityFromSprintData = (sprintData, projects) => {
  // Give me all the sprint Data, the projects to look at and I'll get the velocity

  // Velocity is number of points completed per day;
  // return (+points / +days).toFixed(2);
  const { businessProjectCapacity } = services.calculateSprintCapacity(
    sprintData,
    projects
  );
  const { pointsCompleted } =
    services.calculateTotalSprintStoryTotal(sprintData);

  const sprintVelocity = calculateVelocity(
    pointsCompleted,
    businessProjectCapacity
  );

  // Return everything
  return {
    businessProjectCapacity: businessProjectCapacity,
    pointsCompleted: pointsCompleted,
    sprintVelocity: sprintVelocity,
  };
};

export const calculateTrailingVelocity = (
  sprintData,
  selectedSprint,
  numberOfSprints,
  projects
) => {
  // I expect sprintDataObject (all sprint data), the sprint at which
  // we want a point in time view("W05" for weeks 1 - 5, etc)
  // and the number of sprints you want me to consider.I will then return the average velocity over those sprints.

  // Get the list of sprints to work with:
  //////////////////////////////////////////
  const allSprints = Object.keys(sprintData).sort();
  //Get the index of the sprint we should start from. If does not exist, will be "-1"
  // FIXME: This needs error handling
  const indexOfSprint = allSprints.indexOf(selectedSprint);
  //Cut everything after this sprint, less one (PRIOR TO WHICH)
  allSprints.length = indexOfSprint;
  //Give me $numberOfSprints before the selected sprint
  const consideredSprints = allSprints.slice(-numberOfSprints);
  // Now all we need to do is work out the total velocity accross these sprints (points / days)
  let totalBusinessProjectCapacity = 0;
  let totalPointsCompleted = 0;
  consideredSprints.forEach((weekNum) => {
    const { businessProjectCapacity, pointsCompleted } =
      calculateVelocityFromSprintData(sprintData[weekNum], projects);
    totalBusinessProjectCapacity += businessProjectCapacity;
    totalPointsCompleted += pointsCompleted;
  });
  const trailingSprintVelocity = calculateVelocity(
    totalPointsCompleted,
    totalBusinessProjectCapacity
  );
  return {
    totalBusinessProjectCapacity,
    totalPointsCompleted,
    trailingSprintVelocity,
  };
};
