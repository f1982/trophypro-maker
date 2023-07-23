const { TAU } = require("@jscad/modeling").maths.constants;
import { debounce, union } from "lodash";
import { getBase, getWing } from "./base";
import {
  hdmiSocket,
  lightningSocket,
  microUsbSocket,
  typeCSocket,
  usbASocket,
} from "./sockets";
import {
  center,
  rotate,
  translate,
} from "@jscad/modeling/src/operations/transforms";
import { measureBoundingBox } from "@jscad/modeling/src/measurements";

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

const getHanger = (params: HangerParams) => {
  const base = getBase({
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

  const baseBbox = measureBoundingBox(base);

  const wingLeft = getWing(9, baseBbox[1][1], 5);
  const winbBbox = measureBoundingBox(wingLeft);

  const hanger = union([
    translate(
      [-winbBbox[1][0], 0, baseBbox[1][2]],
      rotate([TAU / 2, 0, 0], wingLeft)
    ),
    // wingLeft,
    base,
  ]);

  return hanger;
  // // center({axes:[true, true, true]}, base);
  // return [center({ axes: [true, true, false] }, union([wingLeft, base]))];
};

export const getHangerDebounce = debounce((params) => getHanger(params), 50);

export { getHanger };
