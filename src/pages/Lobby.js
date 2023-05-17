import React from "react";
import { useNavigate } from "react-router-dom";

import "./Lobby.css";

const Lobby = () => {
  let navigate = useNavigate();

  return (
    <div className="lobby">
      <h1 className="header--option">Choose Code Block</h1>

      <div className="button--container">
        <button
          className="button--big"
          onClick={() => {
            navigate("/page1");
          }}
        >
          Button 1
        </button>
        <button
          className="button--big"
          onClick={() => {
            navigate("/page2");
          }}
        >
          Button 2
        </button>
        <button
          className="button--big"
          onClick={() => {
            navigate("/page3");
          }}
        >
          Button 3
        </button>
        <button
          className="button--big"
          onClick={() => {
            navigate("/page4");
          }}
        >
          Button 4
        </button>
      </div>
    </div>
  );
};

export default Lobby;
