import { union } from "@jscad/modeling/src/operations/booleans";
import { extrudeRotate } from "@jscad/modeling/src/operations/extrusions";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
const { TAU } = require("@jscad/modeling").maths.constants;

import { translateZ } from "@jscad/modeling/src/operations/transforms";
import {
  circle,
  cylinderElliptic,
  sphere,
} from "@jscad/modeling/src/primitives";
import memoize from "fast-memoize";
import { getLogo2 } from "./trophy-logo";

const bProLogo = getLogo2();

const getBody = memoize(({ bottomRadius, topRadius, height }: any) => {
  return [
    translateZ(
      height / 2,
      //endRadius is on the top
      cylinderElliptic({
        height,
        startRadius: [bottomRadius, bottomRadius],
        endRadius: [topRadius, topRadius],
      })
    ),
  ];
});

const getBody2 = memoize(({ bottomRadius, topRadius, height }: any) => {
  console.log("getBody2");

  const p = 2;
  return [
    translateZ(
      bottomRadius,
      sphere({ radius: bottomRadius }),
      translateZ(
        height / 2,
        cylinderElliptic({
          height: height,
          startRadius: [bottomRadius, bottomRadius],
          endRadius: [topRadius, topRadius],
        })
      ),
      translateZ(
        height + p / 2,
        cylinderElliptic({
          height: p,
          startRadius: [topRadius + 2, topRadius + 2],
          endRadius: [topRadius + 2, topRadius + 2],
        })
      ),
      //right hand
      translate(
        [0, bottomRadius - p, height / 2],
        rotate(
          [0, TAU / 4, 0],
          extrudeRotate(
            { segments: 16, angle: TAU / 2 },
            circle({
              radius: 3,
              center: [height / 3, 0],
              startAngle: 0,
              endAngle: 360,
            })
          )
        )
      ),
      //right hand
      translate(
        [0, -bottomRadius + p, height / 2],
        rotate(
          [0, TAU / 4, TAU / 2],
          extrudeRotate(
            { segments: 16, angle: TAU / 2 },
            circle({
              radius: 3,
              center: [height / 3, 0],
              startAngle: 0,
              endAngle: 360,
            })
          )
        )
      ),

      //logo
      translate([(bottomRadius + topRadius) / 2 - p, 0, height / 2], bProLogo)
    ),
  ];
});

export { getBody, getBody2 };
