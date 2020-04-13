import REGL from "regl";
import { mat4 } from "gl-matrix";

import { viewMatrix, projectionMatrix } from "./camera";
import {
  roundCapJoinGeometry,
  interleavedStripRoundCapJoin3DDEMO,
} from "./commands";
import { generateBezier, generateLine } from "./bezier";
import pointFS from "./shaders/point.fs.glsl";
import pointVS from "./shaders/point.vs.glsl";

export default class Point {
  public regl: REGL.Regl;
  public points: any;
  public lineCMD: any;
  public canvas: HTMLCanvasElement;

  // public lines: any;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.regl = REGL({
      canvas,
      extensions: ["ANGLE_instanced_arrays"],
      attributes: {
        antialias: true,
      },
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
    });

    this.points = this.regl({
      frag: pointFS,
      vert: pointVS,
      attributes: {},
      uniforms: {
        time: ({ tick }) => tick * 0.001,
        color: this.regl.prop("color"),
        position: this.regl.prop("position"),
        size: this.regl.prop("size"),
        view: viewMatrix,
        projection: projectionMatrix,
      },
      blend: {
        enable: true,
        func: {
          srcRGB: "src alpha",
          srcAlpha: "src alpha",
          dstRGB: "one minus src alpha",
          dstAlpha: "one minus src alpha",
        },
      },
      depth: {
        enable: false,
      },
      count: 1,
      primitive: "points",
    });

    this.lineCMD = interleavedStripRoundCapJoin3DDEMO(this.regl, 16);
  }

  lines() {
    // console.log(generateBezier([-10, 20, 0], [10, 10, 10]));
    const viewport = {
      x: 0,
      y: 0,
      width: this.canvas.width,
      height: this.canvas.height,
    };
    const resolution = 100;
    const model = mat4.create();

    this.lineCMD({
      // points: generateLine([-10, 20, 0], [], [10, 10, 10], resolution),
      points: generateBezier([-10, 70, 0], [10, 10, 0], resolution),
      width: 4,
      model,
      // view: viewMatrix({ tick: 0 }),
      // projection: projectionMatrix({
      //   viewportWidth: this.canvas.width,
      //   viewportHeight: this.canvas.height,
      // }),
      resolution: [this.canvas.width, this.canvas.height],
      segments: resolution - 1,
      viewport,
    });
  }
}
