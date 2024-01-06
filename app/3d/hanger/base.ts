const { TAU } = require("@jscad/modeling").maths.constants;

import { subtract } from "@jscad/modeling/src/operations/booleans";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { cuboid } from "@jscad/modeling/src/primitives";
import { SocketItemData } from "./sockets";

export const getBase = ({
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
  return subtract(base, models);
};
