export const computeTouchesDistance = (touchA: Touch, touchB: Touch) => {
  return Math.sqrt(
    (touchA.clientX - touchB.clientX) ** 2 +
      (touchA.clientY - touchB.clientY) ** 2
  );
};
