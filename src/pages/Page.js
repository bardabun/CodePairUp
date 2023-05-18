import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CodeBlock from "../components/UIElements/CodeBlock";
import openSocket from "socket.io-client";

import "./Lobby.css";

const Page = () => {
  const [codeBlock, setCodeBlock] = useState({});
  let params = useParams();
  const socket = openSocket("http://localhost:5000");

  useEffect(() => {
    // Fetch the codeBlock data from the server
    // fetch("https://bardabun-server.vercel.app/api/product") //const res = await fetch(SERVER_URL + "/api/product");
    console.log("YOOOOOOOOOOOOOO");
    fetch(`http://localhost:5000/api/codeblocks/${params.aid}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // Set the codeBlock data in the state
          setCodeBlock(data.codeBlock);
        } else {
          console.log("Couldn't find the article");
        }
      })
      .catch((error) => {
        console.log("Error fetching codeBlock data:", error);
      });

    // Connect to the Socket.IO server
    const socket = openSocket("http://localhost:5000");
    // Do something with the socket connection, such as listening for events
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    // Clean up the socket connection when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, [params.aid]);

  useEffect(() => {
    // Listen for code updates from the server
    socket.on("codeUpdated", (updatedCode) => {
      setCodeBlock((prevCodeBlock) => ({
        ...prevCodeBlock,
        code: updatedCode,
      }));
    });

    return () => {
      // Clean up the socket event listener when the component unmounts
      socket.off("codeUpdated");
    };
  }, [socket]);

  const handleCodeChange = (newCode) => {
    // Emit the code update event to the server
    socket.emit("codeUpdate", newCode);
  };

  return (
    <div>
      <h1>Page {codeBlock.title}</h1>
      <CodeBlock code={codeBlock.code} onChange={handleCodeChange} />
    </div>
  );
};

export default Page;
