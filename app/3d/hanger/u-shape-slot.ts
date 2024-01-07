const { TAU } = require("@jscad/modeling").maths.constants;

import { subtract } from "@jscad/modeling/src/operations/booleans";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { polygon } from "@jscad/modeling/src/primitives";
import { getScrewHole } from "./wing";

export const getUShapeSlot = (
  depth: number = 10,
  height: number = 15,
  slotGap: number = 2
) => {
  const lw = 4;
  const rw = 2;
  const bumpHeight = 2;
  const slotDepth = height - 2.4;

  // Create base shape
  const base = polygon({
    points: [
      [0, 0],
      [lw, 0],
      [lw, slotDepth],
      [lw + slotGap, slotDepth],
      [lw + slotGap, 0],
      [lw + slotGap + rw, 0],
      [lw + slotGap + rw, height],
      [lw + slotGap, height + bumpHeight],
      [lw, height + bumpHeight],
      [lw - bumpHeight, height],
      [0, height],
    ],
  });

  // Extrude base shape
  const model = extrudeLinear({ height: depth }, base);

  // Create screw holes
  const screwRadius = 1.4;
  const screw1 = translate(
    [lw, height / 2, depth / 5],
    rotate([0, -TAU / 4, 0], getScrewHole(lw, screwRadius))
  );

  const screw2 = translate(
    [lw, height / 2, (depth / 5) * (5 - 1)],
    rotate([0, -TAU / 4, 0], getScrewHole(lw, screwRadius))
  );

  // Subtract screw holes
  return subtract(model, screw1, screw2);
};
