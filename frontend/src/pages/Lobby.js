import React from "react";
import Button from "../components/UIElements/Button";

import "./Lobby.css";

const Lobby = () => {
  return (
    <div className="lobby">
      <h1 className="header--option">Choose Code Block</h1>

      <div className="buttons--container">
        <Button codeBlockId={1} title={"Sum "} />
        <Button codeBlockId={2} title={"Is Prime Number"} />
        <Button codeBlockId={3} title={"String Reverse"} />
        <Button codeBlockId={4} title={"Count The Vowels"} />
      </div>
    </div>
  );
};

export default Lobby;
