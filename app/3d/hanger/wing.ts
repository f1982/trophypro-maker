const { TAU } = require("@jscad/modeling").maths.constants;

import { subtract } from "@jscad/modeling/src/operations/booleans";
import {
  cuboid,
  cylinder
} from "@jscad/modeling/src/primitives";
import { union } from "lodash";

export const getWing = (w: number, h: number, d: number) => {
  return subtract(
    cuboid({ center: [0, 0, d / 2], size: [w, h, d] }),
    getScrewHole(d, 1)
  );
};

export const getScrewHole = (h: number = 10, r: number = 2) => {
  // const h = 10;
  // const r = 2;
  const hexRadius = r + 1;
  const hexHeight = 0.8;
  return union([
    cylinder({
      center: [0, 0, (h - hexHeight) / 2],
      height: h - hexHeight,
      radius: r,
      segments: 16,
    }),
    cylinder({
      center: [0, 0, h - hexHeight / 2],
      height: hexHeight,
      radius: hexRadius,
      segments: 16,
    }),
  ]);
};