import { Geom3 } from "@jscad/modeling/src/geometries/types";
import { Vec3 } from "@jscad/modeling/src/maths/vec3";
import { measureDimensions } from "@jscad/modeling/src/measurements";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { polygon } from "@jscad/modeling/src/primitives";

export interface SocketItemData {
  model: Geom3 | Geom3[];
  dimensions: Vec3;
  name?: string;
}

export function typeCSocket() {
  const height = 2.4;
  const width = 8.3;
  const depth = 6.2;
  const model = extrudeLinear(
    { height: depth },
    polygon({
      points: [
        [0, 0],
        [width, 0],
        [width, height],
        [0, height],
      ],
    })
  );
  return { name: "USB Type-C", model, dimensions: measureDimensions(model) };
}

export function lightningSocket() {
  const height = 1.5;
  const width = 6.8;
  const depth = 7;
  const model = extrudeLinear(
    { height: depth },
    polygon({
      points: [
        [0, 0],
        [width, 0],
        [width, height],
        [0, height],
      ],
    })
  );
  return { name: "Lightning", model, dimensions: measureDimensions(model) };
}

export function microUsbSocket() {
  const w = 7.4;
  const h = 2.4;
  const d = 6.8;
  const t1 = 1.1;
  const t2 = 1.3;
  const model = extrudeLinear(
    { height: d },
    polygon({
      points: [
        [0, 0],
        [w, 0],
        [w, t1],
        [w - t2, h],
        [t2, h],
        [0, t1],
      ],
    })
  );
  return { name: "USB Micro", model, dimensions: measureDimensions(model) };
}

export function hdmiSocket() {
  const w = 14.4;
  const h = 4.5;
  const s = 3;
  const t1 = 1.0;
  const t2 = 1.4;
  const depth = 10;
  const model = extrudeLinear(
    { height: depth },
    polygon({
      points: [
        [0, 0],
        [w, 0],
        [w, s],
        [w - t1, s],        [w - t2 - t1, h],
        [t1 + t2, h],
        [t1, s],
        [0, s],
      ],
    })
  );
  return { name: "HDMI", model, dimensions: measureDimensions(model) };
}

export function usbASocket() {
  const height = 4.6;
  const width = 12;
  const depth = 12;
  const model = extrudeLinear(
    { height: depth },
    polygon({
      points: [
        [0, 0],
        [width, 0],
        [width, height],
        [0, height],
      ],
    })
  );
  return { name: "USB", model, dimensions: measureDimensions(model) };
}
