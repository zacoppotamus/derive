// import SimplexNoise from "simplex-noise";
import { vec3 } from "gl-matrix";

// const simplexX: SimplexNoise = new SimplexNoise("for X");

export default class Agent {
  pos = [0, 0, 0];
  constructor(startPos = [2.5, 2.5, 2.5]) {
    this.pos = startPos;
  }

  reset() {
    console.log("resetting agent position");
    this.pos = [Math.random(), Math.random(), Math.random()];
  }

  *journey(startPoint, endPoint) {
    this.pos = startPoint;
    let distance = vec3.squaredDistance(this.pos, endPoint);

    while (distance > 0.001) {
      let direction = [0, 0, 0];
      vec3.sub(direction, endPoint, startPoint);
      vec3.normalize(direction, direction);
      vec3.scale(direction, direction, 0.1);
      vec3.add(this.pos, direction, this.pos);

      distance = vec3.squaredDistance(this.pos, endPoint);
      yield this.pos;
    }
  }

  *roam(scale = 0.1) {
    while (true) {
      vec3.add(this.pos, this.pos, [
        (Math.random() - 0.5) * scale,
        (Math.random() - 0.5) * scale,
        (Math.random() - 0.5) * scale,
      ]);
      yield this.pos;
    }
  }
}
