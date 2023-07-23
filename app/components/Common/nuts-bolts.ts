import { colorize } from "@jscad/modeling/src/colors";
import { Vec2, Vec3, Vec3 } from "@jscad/modeling/src/maths/types";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { extrudeFromSlices } from "@jscad/modeling/src/operations/extrusions";
import slice from "@jscad/modeling/src/operations/extrusions/slice";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { cylinder } from "@jscad/modeling/src/primitives";

type BoltOptions = {
  hexWidth: number;
  hexHeight: number;
  threadLength: number;
  threadSize: number;
  innerRadius: number;
  outerRadius: number;
  slicesPerRevolution: number;
  segments: number;
};

export const nutsBoltsDemo = () => {
  const options: BoltOptions = {
    hexWidth: 10,
    hexHeight: 8,
    threadLength: 32,
    threadSize: 4,
    innerRadius: 4,
    outerRadius: 5.6,
    slicesPerRevolution: 12,
    segments: 32,
  };

  return [
    colorize([0.9, 0.6, 0.2], bolt(options)),
    colorize([0.4, 0.4, 0.4], translate([30, 0, 0], nut(options))),
  ];
};

// generate bolt by attaching threads to a hex head
const bolt = (options: BoltOptions) => {
  return union(
    translate([0, 0, options.threadLength], hex(options)),
    threads(options)
  );
};

// generate nut by subtracting threads from a hex block
const nut = (options: BoltOptions) => {
  return subtract(
    hex(options),
    threads({ ...options, threadLength: options.hexHeight })
  );
};

// generate hexagonal block
const hex = (options: BoltOptions) => {
  const radius = options.hexWidth * 1.1547005; // hexagon outer radius
  const height = options.hexHeight;
  return cylinder({ center: [0, 0, height / 2], height, radius, segments: 6 });
};

// generate a threaded shaft using extrudeFromSlices
const threads = (options: BoltOptions) => {
  const { innerRadius, outerRadius, segments, threadLength } = options;
  const revolutions = threadLength / options.threadSize;
  const numberOfSlices = options.slicesPerRevolution * revolutions;
  return extrudeFromSlices(
    {
      numberOfSlices,
      callback: (progress, index, base) => {
        // generate each slice manually
        const points: Vec3[] = [];
        for (let i = 0; i < segments; i++) {
          const pointAngle = (Math.PI * 2 * i) / segments;
          const threadAngle =
            (2 * Math.PI * revolutions * progress) % (Math.PI * 2);

          // define the shape of the threads
          const phase = angleDiff(threadAngle, pointAngle) / Math.PI;
          const radius = lerp(innerRadius, outerRadius, 1.4 * phase - 0.2);

          const x = radius * Math.cos(pointAngle);
          const y = radius * Math.sin(pointAngle);
          points.push([x, y, threadLength * progress]);
        }
        return slice.fromPoints(points);
      },
    },
    {}
  );
};

// linear interpolation with bounding
const lerp = (a: number, b: number, t: number) =>
  Math.max(a, Math.min(b, a + (b - a) * t));

const angleDiff = (angle1: number, angle2: number) => {
  const diff = Math.abs((angle1 - angle2) % (Math.PI * 2));
  return diff > Math.PI ? Math.PI * 2 - diff : diff;
};
