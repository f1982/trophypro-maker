const { TAU } = require("@jscad/modeling").maths.constants;

import { subtract } from "@jscad/modeling/src/operations/booleans";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { cuboid, cylinder, polygon } from "@jscad/modeling/src/primitives";
import { union } from "lodash";
import { getScrewHole } from "./wing";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";

export const getUShapeSlot = (
  depth: number = 10,
  height: number = 15,
  slotGap: number = 2
) => {
  const lw = 4;
  const rw = 2;
  const bumpHeight = 2;
  const slotDepth = height - 2.4;

  const model = extrudeLinear(
    { height: depth },
    polygon({
      points: [
        [0, 0],
        [lw, 0],
        [lw, slotDepth],
        [lw + slotGap, slotDepth],
        [lw + slotGap, 0],
        [lw + slotGap + rw, 0],
        [lw + slotGap + rw, height],
        // bump
        [lw + slotGap, height + bumpHeight],
        [lw, height + bumpHeight],
        [lw - bumpHeight, height],

        //
        [0, height],
      ],
    })
  );

  return subtract(
    model,
    translate(
      [lw, height / 2, depth / 5],
      rotate([0, -TAU / 4, 0], getScrewHole(lw, 1))
    ),
    translate(
      [lw, height / 2, (depth / 5) * (5 - 1)],
      rotate([0, -TAU / 4, 0], getScrewHole(lw, 1))
    )
  );
  // return model;
};
