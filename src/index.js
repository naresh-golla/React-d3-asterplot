import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import PieClass from "./PieClass";

import "./styles.css";

function App() {
  const generateData = (value, length = 9) =>
    d3.range(length).map((item, index) => ({
      date: index,
      value: Math.random() * 100
    }));

  const [data, setData] = useState(generateData(0));
  const changeData = () => {
    setData(generateData());
  };

  useEffect(() => {
    setData(generateData());
  }, [!data]);

  return (
    <div className="App">
      <div>
        <button onClick={changeData}>Random</button>
      </div>

      <div>
        <span className="label">Aster plot</span>
        <PieClass data={data} width={180} height={200} />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
