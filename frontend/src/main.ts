import { vec3 } from "gl-matrix";

import API from "./api";
import Agent from "./agent";
import Point from "./gui/point";

window.addEventListener("click", init);
window.addEventListener("load", loadData);

const api = new API();
const agent = new Agent();
const roamA = agent.roam();

const LATENT_SPACE_SCALE = 2;

let latentSpace: ILatentSpace;
let canvas: HTMLCanvasElement | null;
let gui: any;

let journey;
let agentPos: vec3 = [0, 0, 0];

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
      latentSpace[Math.floor(Math.random() * latentSpace.length)].coordinates,
      latentSpace[Math.floor(Math.random() * latentSpace.length)].coordinates
    );

    draw();
  });
}

function draw() {
  gui.regl.frame(() => {
    const journeyNext = journey.next();
    !journeyNext.done && (agentPos = journeyNext.value);

    gui.regl.clear({ color: [0, 0, 0, 0] });
    gui.points(
      latentSpace.map((c) => ({
        color: [1, 0.2, 0.3, 0.6],
        size: 1,
        position: c.coordinates,
      }))
    );
    gui.points({
      color: [1, 1, 1, 1],
      size: 12,
      position: agentPos,
    });
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
