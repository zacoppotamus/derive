import { vec3 } from "gl-matrix";
import create from "zustand";
import { devtools } from "zustand/middleware";

import Agent from "./agent";
import API from "./api";

const api = new API();
// const agent = new Agent();

const LATENT_SPACE_SCALE = 5;

export const fetchData = async (filename) => {
  return api.coordinates().then((data) => {
    const latentSpace = data;
    latentSpace.forEach((p) => ({
      ...p,
      coordinates: vec3.scale(p.coordinates, p.coordinates, LATENT_SPACE_SCALE),
    }));
    return latentSpace;
  });
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case `ADD_STACK`:
      state.app.queue.unshift(payload);
      return {
        app: {
          ...state.app,
          queue: state.app.queue.slice(0, state.app.queue.length - 1),
        },
      };
    default:
      break;
  }
};

const agent = new Agent([3, 1, 3]);

const initialState = {
  app: {
    agent,
    api,
    queue: new Array(12).fill([]),
  },
  data: [],
  filters: {},
  actions: {
    roam: agent.roam(0.1),
  },
  mutations: {},
};

export const useStore = create(
  devtools((set) => ({
    ...initialState,
    initData: async () => {
      const data = await fetchData();
      set((state) => ({
        data,
      }));
    },
    dispatch: (args) => set((state) => reducer(state, args)),
  }))
);
