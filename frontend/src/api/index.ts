const API_URL = `http://0.0.0.0:8888`;
const API_SIMILARITY_ID = `${API_URL}/similar/id`;
const API_SIMILARITY_VECTOR = `${API_URL}/similar/vector`;
const API_AUDIO_SAMPLE = `${API_URL}/audio`;

const toJSON = (res: any) => res.json();

export default class API {
  constructor() {}

  async similar(x: number): Promise<JSON[]>;
  async similar(x: IVec3): Promise<JSON[]>;

  async similar(a: number | IVec3): Promise<JSON[] | undefined> {
    if (typeof a === "number") {
      return fetch(`${API_SIMILARITY_ID}/${a}`).then(toJSON);
    } else if (typeof a === "object") {
      const { x, y, z } = a;
      return fetch(`${API_SIMILARITY_VECTOR}?x=${x}&y=${y}&z=${z}`).then(
        toJSON
      );
    }

    return;
  }

  sample(id: number): HTMLAudioElement {
    return new Audio(`${API_AUDIO_SAMPLE}/${id}`);
  }
}
