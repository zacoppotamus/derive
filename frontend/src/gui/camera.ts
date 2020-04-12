import { mat4 } from "gl-matrix";

export const viewMatrix = ({ tick }: { tick: number }): mat4 => {
  const t = 0.01 * tick;
  return mat4.lookAt(
    ([] as unknown) as mat4,
    // [10 * Math.cos(t), 0, 80 + 10 * Math.sin(t)],
    [10 * Math.cos(t), 0, 140],
    // [10 * Math.cos(t), 0, 30 + 10 * Math.sin(t)],
    [0, 0, 0],
    [0, 1, 0]
  );
};

export const projectionMatrix = ({
  viewportWidth,
  viewportHeight,
}: {
  viewportWidth: number;
  viewportHeight: number;
}): mat4 =>
  mat4.perspective(
    ([] as unknown) as mat4,
    Math.PI / 4,
    viewportWidth / viewportHeight,
    0.01,
    10000
  );
