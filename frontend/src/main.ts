import { vec3 } from "gl-matrix";
import {
  stream,
  sync,
  fromInterval,
  trace,
  fromIterable,
  fromRAF,
  merge,
  fromEvent,
  sidechainPartition,
} from "@thi.ng/rstream";
import { comp, map, filter } from "@thi.ng/transducers";

import API from "./api";
import Agent from "./agent";
import Point from "./gui/point";
import { generateBezier } from "./gui/bezier";
import { modelMatrix } from "./gui/camera";
import { rnd } from "./utils";

window.addEventListener("click", init);
window.addEventListener("load", loadData);

const api = new API();
const agent = new Agent();
const roamA = agent.roam();

const LATENT_SPACE_SCALE = 5;

let latentSpace: ILatentSpace;
let canvas: HTMLCanvasElement | null;
let gui: any;

let journey;
let agentPos: vec3 = [0, 0, 0];

let refreshJourney;
const refreshNeighbors = fromInterval(1000).subscribe(trace("refresh"));

function loadData() {
  canvas = document.querySelector("canvas");
  if (!canvas) return;
  canvas.height = window.innerHeight * 2;
  canvas.width = window.innerWidth * 2;
  gui = new Point(canvas);

  api.coordinates().then((data) => {
    latentSpace = data;
    latentSpace.forEach((p) => ({
      ...p,
      coordinates: vec3.scale(p.coordinates, p.coordinates, LATENT_SPACE_SCALE),
    }));

    journey = agent.journey(
      latentSpace[Math.floor(rnd.float() * latentSpace.length)].coordinates,
      latentSpace[Math.floor(rnd.float() * latentSpace.length)].coordinates
    );

    // refreshJourney = fromIterable(journey).subscribe(
    //   trace("refreshing journey")
    // );

    draw();
  });
}

function draw() {
  // let lineBuffers;
  let lineCoords = [];
  let lineResolution = 100;

  const response = sync<any, any>({
    src: { refreshNeighbors },
    xform: comp(
      filter(({ refreshNeighbors }) => refreshNeighbors < 10),
      map(({ refreshNeighbors }) =>
        api
          .similar({ x: agentPos[0], y: agentPos[1], z: agentPos[2] })
          .then((samples) => {
            console.log(samples);
            lineCoords = samples.map((s) =>
              vec3.scale(
                ([] as unknown) as vec3,
                s.coordinates,
                LATENT_SPACE_SCALE
              )
            );
            // lineBuffers = samples.map(s =>
            //   generateBezier(s.coordinates, agentPos, lineResolution)
            // );
          })
      )
    ),
  });
  fromIterable(journey)
    .subscribe(sidechainPartition(fromRAF()))
    .subscribe((d) => {
      console.log(d, "bla");
    });
  // fromRAF().subscribe(d => {
  //   console.log("raf", d);
  // });
  // merge([fromEvent(document, "mousemove"), fromEvent(document, "mousedown")])
  //   .subscribe(sidechainPartition(fromRAF()))
  //   .subscribe(trace("bla"));

  gui.regl.frame(() => {
    const journeyNext = journey.next();
    !journeyNext.done && (agentPos = journeyNext.value);

    gui.regl.clear({ color: [0, 0, 0, 0.5] });
    gui.points(
      latentSpace.map((c) => ({
        color: [1, 0.2, 0.3, 0.6],
        size: 3,
        position: c.coordinates,
      }))
    );
    gui.points({
      color: [1, 1, 1, 1],
      size: 12,
      position: agentPos,
    });
    // gui.lines(agentPos);
    if (lineCoords.length && canvas) {
      gui.lineCMD(
        lineCoords.map((l) => ({
          points: generateBezier(l, agentPos, lineResolution),
          width: 2,
          model: modelMatrix,
          resolution: [canvas?.width, canvas?.height],
          segments: lineResolution - 1,
          viewport: {
            x: 0,
            y: 0,
            width: canvas?.width,
            height: canvas?.height,
          },
        }))
      );
    }
  });
}

function init() {
  api.similar(96166).then((d) => {
    console.log(d);
  });
  api.similar({ x: 6, y: 5, z: 0 }).then((d) => {
    const ids: number[] = d.map((sample) => sample.id);
    console.log(ids);

    // const audio: HTMLAudioElement = api.sample(ids[0]);
    ids
      .map((id) => api.sample(id))
      .map((a) => {
        a.addEventListener("canplaythrough", (e) => {
          // a.play();
        });
      });
  });
}

// animate();

// function animate() {
//   requestAnimationFrame(animate);
// }
