interface IVec3 {
  x: number;
  y: number;
  z: number;
}

interface IObservation {
  id: number;
  coordinates: [number, number, number];
  tags: string[];

  avg_rating?: number;
  bitdepth?: number;
  bitrate?: number;
  created?: string | Date;
  description?: string;
  download?: string;
  duration?: number;
  filesize?: number;
  geotag?: string;
  license?: string;
  name?: string;
  num_comments?: number;
  num_downloads?: number;
  num_ratings?: number;
  previews?: { any: any };
  samplerate?: number;
  type?: string;
  username?: string;
  filename?: string;
  __label?: number;
}

type ILatentSpace = IObservation[];

type AppState = {
  animationValue: boolean;
  frameValue: number;
  keyValue: string | null;
};

declare module "*.glsl" {
  const value: string;
  export default value;
}
