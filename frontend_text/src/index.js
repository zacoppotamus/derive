import React, { useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import "basscss/css/basscss.min.css";

import "./index.css";
import App from "./App";
import { useStore } from "./store";
import reportWebVitals from "./reportWebVitals";

const DataProvider = ({ render }) => {
  const initData = useStore(useCallback((state) => state.initData, []));
  const data = useStore((state) => state.data);

  useEffect(() => {
    console.info("initializing data...");
    initData();
  }, [initData]);

  return data.length ? render(data) : <h1>Loading</h1>;
};

ReactDOM.render(
  <React.StrictMode>
    <DataProvider render={(data) => <App data={data} />} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
