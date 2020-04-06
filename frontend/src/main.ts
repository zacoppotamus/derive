import API from "./api";
import Agent from "./agent";
import Point from "./gui/point";

window.addEventListener("click", init);
window.addEventListener("load", initScene);

const api = new API();
const agent = new Agent();
const roamA = agent.roam();

function initScene() {
  console.log("hello", document.querySelector("canvas"));
  const canvas: HTMLCanvasElement | null = document.querySelector("canvas");
  if (!canvas) return;
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

  const point = new Point(canvas);
  point.regl.frame(({ tick }) => {
    point.regl.clear({ color: [1, 1, 0, 0] });
    point.draw({
      position: roamA.next().value,
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
          a.play();
        });
      });
  });
}

// animate();

// function animate() {
//   requestAnimationFrame(animate);
// }
