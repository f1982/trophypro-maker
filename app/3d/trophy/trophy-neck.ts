import { union } from "@jscad/modeling/src/operations/booleans";
import {
  extrudeRectangular
} from "@jscad/modeling/src/operations/extrusions";
const { TAU } = require("@jscad/modeling").maths.constants;

import { translateZ } from "@jscad/modeling/src/operations/transforms";
import {
  cylinder,
  square
} from "@jscad/modeling/src/primitives";
import memoize from "fast-memoize";

const getNeck = memoize(({ size, height, bottomHeight }: any) => {
  console.log('create neck')
  return union(
    translateZ(
      bottomHeight + height / 2,
      cylinder({ height: height, radius: size })
    ),
    translateZ(
      bottomHeight / 2,
      cylinder({ height: bottomHeight, radius: size + bottomHeight })
    )
  );
});

const getNeck2 = memoize(({ size, height, bottomHeight }: any) => {
  return union(
    translateZ(
      bottomHeight,
      extrudeRectangular(
        { size: 1, height: height, twistAngle: TAU / 2 },
        square({ size: size })
      )
    ),
    translateZ(
      bottomHeight / 2,
      cylinder({ height: bottomHeight, radius: size + bottomHeight })
    )
  );
});

export { getNeck, getNeck2 };
