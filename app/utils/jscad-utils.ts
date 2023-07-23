import { colorize } from "@jscad/modeling/src/colors";
import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { hullChain } from "@jscad/modeling/src/operations/hulls";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { circle, cuboid } from "@jscad/modeling/src/primitives";
import { vectorText } from "@jscad/modeling/src/text";
import { Bounds } from "react-use-gesture/dist/types";
const { deserializers } = require("@jscad/io");

const STLserializer = require("@jscad/stl-serializer");
const saveAs = require("file-saver");

/**
 * Save STL file
 * @param filename
 * @param geometries
 */
export const saveSTL = (filename: string, geometries: Geom3 | Geom3[]) => {
  const rawData = STLserializer.serialize({ binary: true }, geometries);
  const blob = new Blob(rawData);
  saveAs(blob, filename + ".stl");
};

// Build text by creating the font strokes (2D)
// https://github.com/jscad/OpenJSCAD.org/issues/907
export const text2d = (
  input: string,
  characterLineWidth: number,
  segments: number
) => {
  const lineRadius = characterLineWidth / 2;
  const lineCorner = circle({ radius: lineRadius, segments: segments });
  const lineSegmentPointArrays = vectorText({ xOffset: 0, yOffset: 0, input }); // line segments for each character
  const lineSegments: any[] = [];
  lineSegmentPointArrays.forEach((segmentPoints) => {
    // process the line segment
    const corners = segmentPoints.map((point) => translate(point, lineCorner));
    const hull = hullChain(corners);
    lineSegments.push(hull);
  });
  return union(lineSegments);
};

export const svgToGem = ({
  svg,
  height = 5,
}: {
  svg: string;
  height: number;
}) => {
  let s = deserializers.svg({ output: "geometry", target: "geom2" }, svg);
  // merge sides
  s = {
    ...s[0],
    sides: [...s[0].sides, ...s[1].sides],
  };
  return extrudeLinear({ height }, s);
};


export const buildBoundingBox = (bounds:any[]) => {
  // Bounding box format is an array of arrays of values, eg:
  //     [LowerBoundsValues, UpperBoundsValues]
  //     [[left, front, bottom], [right, back, top]]
  //     [[-3, 2, 0], [3, 6, 10]]

  const top = bounds[1][2]
  const bottom = bounds[0][2]
  const left = bounds[0][0]
  const right = bounds[1][0]
  const front = bounds[0][1]
  const back = bounds[1][1]

  const width = right - left
  const height = top - bottom
  const depth = back - front

  let boundingBox = subtract(
    cuboid({ size: [width + 1, depth + 1, height + 1] }),
    cuboid({ size: [width + 1, depth, height] }),
    cuboid({ size: [width, depth + 1, height] }),
    cuboid({ size: [width, depth, height + 1] })
  )

  boundingBox = translate([(left + right) / 2, (front + back) / 2, (top + bottom) / 2], boundingBox)
  boundingBox = colorize([0.5, 0, 0], boundingBox)
  return boundingBox
}
