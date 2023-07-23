import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import {
  rotate,
  scale,
  translate,
} from "@jscad/modeling/src/operations/transforms";
const { TAU } = require("@jscad/modeling").maths.constants;

import { measureDimensions } from "@jscad/modeling/src/measurements";
import memoize from "fast-memoize";
import { text2d } from "~/utils/jscad-utils";

const getWinnerName = memoize((name: string) => {
  const nameScale = 0.2;
  let winner = extrudeLinear({ height: 4 }, text2d(name, 5, 6));
  const dimension = measureDimensions(winner);
  winner = translate(
    [0, -dimension[1] / 2, dimension[2] / 2],
    scale(
      [nameScale, nameScale, nameScale],
      rotate([TAU / 4, 0, TAU / 4], winner)
    )
  );
  return winner;
});

export { getWinnerName };
