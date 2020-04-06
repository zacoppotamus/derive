// import SimplexNoise from "simplex-noise";
import { vec3 } from "gl-matrix";

// const simplexX: SimplexNoise = new SimplexNoise("for X");

export default class Agent {
  private pos: vec3 = [0, 0, 0];
  constructor() {
    this.pos = [3, 1, 3];
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
