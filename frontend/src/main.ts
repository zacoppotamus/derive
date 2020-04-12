import API from "./api";
import Agent from "./agent";
import Point from "./gui/point";

window.addEventListener("click", init);
window.addEventListener("load", loadData);

const api = new API();
const agent = new Agent();
const roamA = agent.roam();

let coordinates: ILatentSpace;
let canvas: HTMLCanvasElement | null;
let gui: any;

function loadData() {
  canvas = document.querySelector("canvas");
  if (!canvas) return;
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  gui = new Point(canvas);

  api.coordinates().then((d) => {
    coordinates = d;
    console.log(coordinates);
    draw();
  });
}

function draw() {
  gui.regl.frame(() => {
    gui.regl.clear({ color: [0, 0, 0, 0.1] });
    gui.draw({
      color: [1, 1, 1, 1],
      size: 10,
      position: roamA.next().value,
    });
    gui.draw(
      coordinates.map((c) => ({
        color: [1, 0.2, 0.3, 0.6],
        size: 1,
        position: c.coordinates.map((n) => n * 2),
      }))
    );
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
