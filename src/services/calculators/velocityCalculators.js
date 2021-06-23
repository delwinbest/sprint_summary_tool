export const calculateVelocity = (points, days) => {
  // Probably doesnt warrant its own function, but here goes.
  // I expect points and number of days. I will return the velocity metrics.

  // Velocity is number of points completed per day;
  return (points / days).toFixed(2);
};
