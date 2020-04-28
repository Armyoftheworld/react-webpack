import React from "react";

import "./app.css";
import beauty from "./images/beauty.jpg";

function App() {
  return (
    <div>
      <span className="App iconfont">Hello World, i am changed. &#xe657;</span>
      <img className="beauty" src={beauty} />
    </div>
  );
}

export default App;
