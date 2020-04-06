import REGL from "regl";
import { mat4 } from "gl-matrix";

export default class Point {
  public regl: REGL.Regl;
  public draw: any;
  constructor(canvas: HTMLCanvasElement) {
    this.regl = REGL({ canvas });
    this.draw = this.regl({
      frag: `
        precision mediump float;
        void main() {
          if (length(gl_PointCoord.xy - 0.5) > 0.5) {
            discard;
          }
          gl_FragColor = vec4(1.);
        }`,
      vert: `
        uniform vec3 position;
        uniform mat4 view, projection;

        // vec3 position = vec3(1.);

        void main() {
          gl_PointSize = 5.;
          gl_Position = projection * view * vec4(position, 1.);
        }
      `,
      attributes: {
        // position: [0, 0, 0],
      },
      uniforms: {
        time: ({ tick }) => tick * 0.001,
        position: this.regl.prop("position"),
        view: ({ tick }) => {
          const t = 0.01 * tick;
          return mat4.lookAt(
            ([] as unknown) as mat4,
            [10 * Math.cos(t), 0, 30 + 10 * Math.sin(t)],
            [0, 0, 0],
            [0, 1, 0]
          );
        },
        projection: ({ viewportWidth, viewportHeight }) =>
          mat4.perspective(
            ([] as unknown) as mat4,
            Math.PI / 4,
            viewportWidth / viewportHeight,
            0.01,
            1000
          ),
      },
      // depth: {
      //   enable: true,
      // },
      count: 1,
      primitive: "points",
    });
  }
}
