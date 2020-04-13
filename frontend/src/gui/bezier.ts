import { vec3 } from "gl-matrix";
import Bezier from "bezier-js";

export function generateBezier(sp: vec3, ep: vec3, resolution: number): vec3[] {
  const control = [] as vec3;
  vec3.sub(control, ep, sp);
  vec3.scale(control, control, 0.5);
  // console.log(...[...sp, ...control, ...ep]);
  // const b: Bezier = Bezier.quadraticFromPoints(...[...sp, ...control, ...ep]);
  const b: Bezier = Bezier.quadraticFromPoints(
    { x: sp[0], y: sp[1], z: sp[2] },
    {
      x: control[0],
      y: control[1],
      z: control[2],
    },
    {
      x: ep[0],
      y: ep[1],
      z: ep[2],
    },
    0.2
  );
  // console.log();
  // return b.getLUT(10);
  return b.getLUT(resolution).flatMap((point) => [point.x, point.y, 0]);
}

export function generateLine(
  sp: vec3,
  cp: vec3,
  ep: vec3,
  resolution: number
): vec3[] {
  let o = [];
  let out = [] as vec3;
  vec3.copy(out, sp);

  const step = [0, 0, 0] as vec3;
  vec3.sub(step, ep, sp);
  vec3.scale(step, step, 1 / resolution);
  // console.log(step);

  for (let i = 0; i < resolution; i++) {
    const p = vec3.add([], out, step);
    o.push(p);
    vec3.add(out, out, step);
  }
  return o;
}
