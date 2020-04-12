// import SimplexNoise from "simplex-noise";
import { vec3 } from "gl-matrix";

// const simplexX: SimplexNoise = new SimplexNoise("for X");

export default class Agent {
  private pos: vec3 = [0, 0, 0];
  constructor() {
    this.pos = [3, 1, 3];
  }

  *journey(startPoint: vec3, endPoint: vec3) {
    this.pos = startPoint;
    let distance = vec3.squaredDistance(this.pos, endPoint);

    while (distance > 0.001) {
      let direction: vec3 = [0, 0, 0];
      vec3.sub(direction, endPoint, startPoint);
      vec3.normalize(direction, direction);
      vec3.scale(direction, direction, 0.1);
      vec3.add(this.pos, direction, this.pos);

      distance = vec3.squaredDistance(this.pos, endPoint);
      yield this.pos;
    }
  }

  *roam() {
    while (true) {
      vec3.add(this.pos, this.pos, [
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
      ]);
      yield this.pos;
    }
  }
}
