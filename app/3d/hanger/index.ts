const { TAU } = require("@jscad/modeling").maths.constants;
import { measureAggregateBoundingBox } from "@jscad/modeling/src/measurements";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { debounce, union } from "lodash";
import { getBase, getEar, getScrewHole } from "./base";
import {
  hdmiSocket,
  lightningSocket,
  microUsbSocket,
  typeCSocket,
  usbASocket,
} from "./sockets";

export interface HangerParams {
  gap: number;
  marginH: number;
  marginV: number;
}

export const paramConfiguration = {
  gap: {
    label: "Gap between sockets",
    value: 10,
    min: 2,
    max: 20,
    step: 2,
  },
  marginH: {
    label: "Base Horizontal Margin",
    value: 2,
    min: 2,
    max: 10,
    step: 1,
  },
  marginV: {
    label: "Base Vertical Margin",
    value: 2,
    min: 1,
    max: 8,
    step: 1,
  },
};

// const getHanger = (params: HangerParams) => {
//   return getEar(10,10,4);
//   // return getScrewHole(4, 2);
// };
const getHanger = (params: HangerParams) => {
  const hub = getBase({
    gapBetweenSocket: params.gap,
    marginH: params.marginH,
    marginV: params.marginV,
    sockets: [
      typeCSocket(),
      hdmiSocket(),
      microUsbSocket(),
      usbASocket(),
      lightningSocket(),
      hdmiSocket(),
    ],
  });
  const hubBoundingBox = measureAggregateBoundingBox(hub);
  const hubHeight = -(hubBoundingBox[0][1] - hubBoundingBox[1][1]); //y axis length
  
  const earLeft = getEar(9, hubHeight, 4);
  const earRight = getEar(9, hubHeight, 4);
  const earBounding = measureAggregateBoundingBox(earLeft);

  const hanger = union([
    translate(
      [-earBounding[1][0], 0, hubBoundingBox[1][2]],
      rotate([TAU / 2, 0, 0], earLeft)
    ),
    translate(
      [hubBoundingBox[1][0] + earBounding[1][0], 0, hubBoundingBox[1][2]],
      rotate([TAU / 2, 0, TAU / 2], earRight)
    ),
    hub,
  ]);

  // the ear is out of 0 of x axis
  return rotate(
    [-TAU / 4, 0, 0],
    translate([-hubBoundingBox[1][0] / 2, 0, 0], hanger)
  );
};

export const getHangerDebounce = debounce((params) => getHanger(params), 50);

export { getHanger };
