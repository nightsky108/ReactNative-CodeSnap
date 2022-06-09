/**
 * This file contains metric values that are global to the application.
 */

// Examples of metrics you can define:
export const tiny = 4;
export const small = tiny * 3;
export const normal = tiny * 4;
export const medium = tiny * 5;

export const MarginSize = {
  m0: tiny,
  m1: tiny * 2,
  m2: tiny * 3,
  m3: tiny * 4,
  m4: tiny * 5,
  m5: tiny * 6,
};

export const PaddingSize = {
  p0: tiny,
  p1: tiny * 2,
  p2: tiny * 3,
  p3: tiny * 4,
  p4: tiny * 5,
  p5: tiny * 6,
};

const Metrics = {
  tiny,
  small,
  normal,
  medium,
};
export default Metrics;
