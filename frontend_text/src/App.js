import React, { useCallback, useEffect, useRef } from "react";
import { useFrame, Canvas } from "react-three-fiber";
import * as THREE from "three";

import { useInterval, useKeyPress } from "./utils/hooks";
import { useStore } from "./store";

function App({ data }) {
  const api = useStore((state) => state.app.api);
  const agent = useStore((state) => state.app.agent);
  const queue = useStore((state) => state.app.queue);
  const dispatch = useStore((state) => state.dispatch);
  const roam = useStore((state) => state.actions.roam);

  const escPress = useKeyPress("Escape");

  const agentPosition = useRef(new Array(12).fill([1, 2, 3]));

  const intervalic = useCallback(() => {
    const pos = roam.next().value;
    agentPosition.current.unshift(pos);
    agentPosition.current = agentPosition.current.slice(
      0,
      agentPosition.current.length - 1
    );
    console.log(agentPosition.current);
    api.similar({ x: pos[0], y: pos[1], z: pos[2] }).then((d) => {
      dispatch({ type: `ADD_STACK`, payload: d });
    });
  }, [dispatch, api, roam]);

  useEffect(() => {
    escPress && agent.reset();
  }, [agent, escPress]);
  // intervalic();

  useInterval(intervalic, 1000);

  return (
    <div id="app__container">
      <div className="flex flex-row">
        {queue.slice(0, 6).map((row, i) => (
          <div
            style={{ height: `80vh` }}
            className="flex flex-column justify-between lg-col-2 px1"
          >
            <div>
              {agentPosition.current[i][0].toFixed(2)} / {` `}
              {agentPosition.current[i][1].toFixed(2)} / {` `}
              {agentPosition.current[i][2].toFixed(2)}
            </div>
            {row.slice(0, 8).map((c) => (
              <div style={{ backgroundColor: `none` }}>
                {c.tags.join(" / ")}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
