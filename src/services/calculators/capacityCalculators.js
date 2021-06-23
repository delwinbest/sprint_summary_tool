export const calculateBusinessProjectCapacity = (sprintData, projectData) => {
  // I Expect to get the sprint object and the Project Data object, and then return the capacity relating to BUSINESS Projects (OP1/OP2 Projects, Etc)

  // Then filter NON Projects using the Project data
  const businessProjects = Object.keys(projectData).filter(
    (project) =>
      projectData[project].type.startsWith("PROJECT") &&
      projectData[project].active === true
  );

  // Now Look at the planned capacity and sum up the number of days each employee MAY have assigned to this project
  let businessProjectCapacity = 0;
  businessProjects.forEach((project) => {
    Object.keys(sprintData.capacity).forEach((member) => {
      if (sprintData.capacity[member][project] !== undefined) {
        businessProjectCapacity += +sprintData.capacity[member][project];
      }
    });
  });

  return { businessProjectCapacity };
};

export const calculateOOTOCapacity = (sprintData, projectData) => {
  // I Expect to get the sprint object and the Project Data object, and then return the capacity relating to OOTO (OOTO, Holiday, Bank Holiday, Etc)

  // Then filter NON Projects using the Project data
  const ootoProjects = Object.keys(projectData).filter(
    (project) =>
      projectData[project].type.startsWith("OOTO") &&
      projectData[project].active === true
  );

  // Now Look at the planned capacity and sum up the number of days each employee MAY have assigned to this project
  let ootoCapacity = 0;
  ootoProjects.forEach((project) => {
    Object.keys(sprintData.capacity).forEach((member) => {
      if (sprintData.capacity[member][project] !== undefined) {
        ootoCapacity += +sprintData.capacity[member][project];
      }
    });
  });

  return { ootoCapacity };
};

export const calculateNonProjectCapacity = (sprintData, projectData) => {
  // I Expect to get the sprint object and the Project Data object, and then return the capacity relating to Non Projects (KTLO, OE, Etc)

  // Then filter NON Projects using the Project data
  const nonProjects = Object.keys(projectData).filter(
    (project) =>
      projectData[project].type.startsWith("NON_PROJECT") &&
      projectData[project].active === true
  );

  // Now Look at the planned capacity and sum up the number of days each employee MAY have assigned to this project
  let nonProjectCapacity = 0;
  nonProjects.forEach((project) => {
    Object.keys(sprintData.capacity).forEach((member) => {
      if (sprintData.capacity[member][project] !== undefined) {
        nonProjectCapacity += +sprintData.capacity[member][project];
      }
    });
  });

  return { nonProjectCapacity };
};

export const calculateSprintCapacity = (sprintData, projectData) => {
  // THIS IS ALL DAY CAPACITY
  // I Expect to get the sprint object and the Project Data object, and then return the capacity in multiple dimentions

  // Get the capacity assigned to Non Projects in this Sprint
  const { nonProjectCapacity } = calculateNonProjectCapacity(
    sprintData,
    projectData
  );

  // Get the capacity assigned to Business Projects in this Sprint
  const { businessProjectCapacity } = calculateBusinessProjectCapacity(
    sprintData,
    projectData
  );

  // Get the capacity assigned to OOTO in this Sprint
  const { ootoCapacity } = calculateOOTOCapacity(sprintData, projectData);

  // Get Total DAY Capacity Base on Members in Team
  const totalSprintCapacity =
    +sprintData.sprintDurationDays * sprintData.members.length;

  return {
    nonProjectCapacity,
    businessProjectCapacity,
    ootoCapacity,
    totalSprintCapacity,
  };
};
