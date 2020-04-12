interface IVec3 {
  x: number;
  y: number;
  z: number;
}

interface IObservation {
  id: number;
  coordinates: [number, number, number];
  tag: string[];
}

type ILatentSpace = IObservation[];

declare module "*.glsl" {
  const value: string;
  export default value;
}
