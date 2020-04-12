import REGL from "regl";
import { viewMatrix, projectionMatrix } from "./camera";
import pointFS from "./shaders/point.fs.glsl";
import pointVS from "./shaders/point.vs.glsl";

export default class Point {
  public regl: REGL.Regl;
  public points: any;
  public lines: any;
  constructor(canvas: HTMLCanvasElement) {
    this.regl = REGL({
      canvas,
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
  }
}
