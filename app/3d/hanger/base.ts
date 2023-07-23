const { TAU } = require("@jscad/modeling").maths.constants;

import { subtract } from "@jscad/modeling/src/operations/booleans";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import {
  cuboid,
  cylinder,
  roundedCuboid,
} from "@jscad/modeling/src/primitives";
import memoize from "fast-memoize";
import { SocketItemData } from "./sockets";
import { union } from "lodash";
import { measureBoundingBox } from "@jscad/modeling/src/measurements";

export const getBase = memoize(
  ({
    gapBetweenSocket = 10,
    marginH = 6,
    marginV = 2,
    sockets,
  }: {
    gapBetweenSocket?: number;
    marginH?: number;
    marginV?: number;
    sockets: SocketItemData[];
  }) => {
    const gap = gapBetweenSocket;
    const margin = [marginH, marginV];

    const len = sockets.length;

    //Add gaps between socket and 2 horizontal margin
    let baseWidth = sockets
      .map(({ dimensions }) => dimensions[0])
      .reduce((acc, val) => acc + val);
    baseWidth += gap * (len - 1) + 2 * margin[0];

    //Get the max-height of the socket and apply margin[1] to it
    let baseHeight = sockets
      .map(({ dimensions }) => dimensions[1])
      .reduce((acc, val) => (acc = acc > val ? acc : val));
    baseHeight += margin[1] * 2;

    //Get the max depth of all the socket and add 4mm wall
    let baseDepth = sockets
      .map(({ dimensions }) => dimensions[2])
      .reduce((acc, val) => (acc = acc > val ? acc : val));
    baseDepth += 4;

    // const base = roundedCuboid({
    const base = cuboid({
      center: [baseWidth / 2, 0, baseDepth / 2],
      size: [baseWidth, baseHeight, baseDepth],
      // roundRadius: 1,
      // segments: 4,
    });

    let px = margin[0];
    const models = sockets.map(({ model, dimensions }, index) => {
      model = translate([px, -dimensions[1] / 2, 0], model);
      px += dimensions[0] + gap;
      return model;
    });
    //Rotate -90 degree before display
    // return rotate([-TAU / 4, 0, 0], [subtract(base, models), getScrewHole()]);
    const main = subtract(base, models);
    return main;
    // const baseBbox = measureBoundingBox(main);
    // const wing = getWingBase(baseBbox[1][0], baseBbox[1][1], 3);
    // const winbBbox = measureBoundingBox(wing);

    // const adjustedWing = translate(
    //   [-baseBbox[1][0] / 2, 0, winbBbox[1][2]],
    //   rotate([TAU / 2, 0, 0], wing)
    // );
    // return [adjustedWing, main];
  }
);

export const getWing = (w: number, h: number, d: number) => {
  return subtract(getWingBase(w, h, d), getScrewHole());
  // return getScrewHole();
};

// center?: Vec3
//   height?: number
//   radius?: number
//   segments?: number

export const getScrewHole = () => {
  const h = 10;
  const r = 2;
  const hexRadius = r + 3;
  const hexHeight = 2;
  return union([
    cylinder({ center: [0, 0, h / 2], height: h, radius: r, segments: 16 }),
    cylinder({
      center: [0, 0, h + hexHeight / 2],
      height: hexHeight,
      radius: hexRadius,
      segments: 16,
    }),
  ]);
};

export const getWingBase = (w: number = 10, h: number = 10, d: number = 10) => {
  return cuboid({ center: [0, 0, d/2], size: [w, h, d] });
};
