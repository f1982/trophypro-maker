import { translate } from "@jscad/modeling/src/operations/transforms";
const { TAU } = require("@jscad/modeling").maths.constants;

import { Vec3 } from "@jscad/modeling/src/maths/vec3";
import { translateZ } from "@jscad/modeling/src/operations/transforms";
import { cuboid } from "@jscad/modeling/src/primitives";
import { getWinnerName } from "./trophy-winner";
import memoize from "fast-memoize";

const getBase = memoize(
  ({ w, l, h, padding, bottomLayerHeight, name }: any) => {
    console.log("create base");
    const c: Vec3 = [0, 0, 0];

    let base = [
      translateZ(
        h / 2 + bottomLayerHeight,
        cuboid({ size: [w - padding, l - padding, h], center: c })
      ), //top
      translateZ(
        bottomLayerHeight / 2,
        cuboid({ size: [w, l, bottomLayerHeight], center: c })
      ), //bottom
    ];
    if (name) {
      let winner = getWinnerName(name);
      winner = translate([w / 2 - padding, l / 2, 0], winner);
      return [...base, winner];
    }

    return base;
  }
);

export { getBase };
