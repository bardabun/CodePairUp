import React from "react";
import Button from "../components/UIElements/Button";

import "./Lobby.css";

const Lobby = () => {
  return (
    <div className="lobby">
      <h1 className="header--option">Choose Code Block</h1>

      <div className="button--container">
        <Button codeBlockTitle={1} />
        <Button codeBlockTitle={2} />
        <Button codeBlockTitle={3} />
        <Button codeBlockTitle={4} />
      </div>
    </div>
  );
};

export default Lobby;
