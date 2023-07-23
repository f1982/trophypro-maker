const { TAU } = require("@jscad/modeling").maths.constants;
import { debounce } from "lodash";
import { translateZ } from "@jscad/modeling/src/operations/transforms";
import { getBase } from "./Trophy/trophy-base";
import { getBody2 } from "./Trophy/trophy-body";
import { getNeck } from "./Trophy/trophy-neck";

export interface TrophyParameters {
  name?: string;
  vertices: number;
  height: number;
}

export interface TrophyProps {
  scale: number;
  baseWidth: number;
  baseLength: number;
  baseHeight: number;
  neckSize: number;
  neckHeight: number;
  bodyTopRadius: number;
  bodyBottomRadius: number;
  bodyHeight: number;
  winner: string;
}

var trophy: any[] = [];
var count = 0

const getTrophy = (params: TrophyProps) => {
  const pScale = params.scale;

  const base = getBase({
    w: params.baseWidth * pScale,
    l: params.baseLength * pScale,
    h: params.baseHeight * pScale,
    padding: 2 * pScale,
    bottomLayerHeight: 2 * pScale,
    name: params.winner,
  });

  const neck = translateZ(
    params.baseHeight * pScale,
    getNeck({
      size: params.neckSize * pScale,
      height: params.neckHeight * pScale,
      bottomHeight: 6 * pScale,
    })
  );

  const body = translateZ(
    (params.baseHeight + params.neckHeight) * pScale,
    getBody2({
      bottomRadius: params.bodyBottomRadius * pScale,
      topRadius: params.bodyTopRadius * pScale,
      height: params.bodyHeight * pScale,
    })
  );

  return [...base, neck, ...body];
};

export const getTrophyDebounce =  debounce((params)=>getTrophy(params),1000)

export { getTrophy };
