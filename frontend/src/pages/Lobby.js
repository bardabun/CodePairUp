import React from "react";
import Button from "../components/UIElements/Button";

import "./Lobby.css";

const Lobby = () => {
  return (
    <div className="lobby">
      <h1 className="header--option">Choose Code Block</h1>
      <p className="intro">
        This web application assignment involves building a collaborative
        platform where users can participate in a series of questions. <br />
        Upon accessing the application, the first user becomes the 'Mentor' and
        gains access to a fixed code block. <br />
        Subsequent users can join the session and have the ability to modify
        their own code block. <br />
        <br />
        Notably, all code changes made by any user are instantly propagated{" "}
        <br />
        and reflected live for all connected users, thanks to the use of web
        sockets. <br />
        {/* In addition to code editing, users can answer the provided questions,
        submit their responses, and receive timely feedback on their
        submissions. */}
      </p>

      <div className="buttons--container">
        <Button codeBlockId={1} title={"Sum Number"} />
        <Button codeBlockId={2} title={"Is Prime Number"} />
        <Button codeBlockId={3} title={"String Reverse"} />
        <Button codeBlockId={4} title={"Count The Vowels"} />
      </div>
    </div>
  );
};

export default Lobby;
