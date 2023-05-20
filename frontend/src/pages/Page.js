import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CodeBlock from "../components/UIElements/CodeBlock";
import { io } from "socket.io-client";

import "./page.css";

// Connect to the Socket.IO server
const socket = io("http://localhost:5000", { autoConnect: false });

const Page = () => {
  const [codeBlock, setCodeBlock] = useState({ id: "", title: "", code: "" });
  const [role, setRole] = useState(null);
  const [typedCode, setTypedCode] = useState("");
  const [showSmile, setShowSmile] = useState(false);

  let params = useParams();

  useEffect(() => {
    // Fetch the codeBlock data from the server
    // fetch("https://bardabun-server.vercel.app/api/product") //const res = await fetch(SERVER_URL + "/api/product");
    fetch(`https://code-pair-up-client.vercel.app/api/codeblocks/${params.aid}`)
      // fetch(`http://localhost:5000/api/codeblocks/${params.aid}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.codeBlock) {
          // Set the codeBlock data in the state
          setCodeBlock(data.codeBlock);
        } else {
          console.log("Couldn't find the article");
        }
      })
      .catch((error) => {
        console.log("Error fetching codeBlock data:", error);
      });
  }, [params.aid]);

  useEffect(() => {
    // Listen for code updates from the server
    socket.on("codeUpdated", (updatedCode) => {
      setCodeBlock((prevCodeBlock) => ({
        ...prevCodeBlock,
        code: updatedCode,
      }));
    });

    socket.on("userRole", (roleFromServer) => {
      if (role === "viewer" || roleFromServer === "viewer") {
        setRole("viewer");
      } else if (roleFromServer === "editor") {
        setRole("editor");
      }
    });

    socket.connect();

    return () => {
      // Clean up the socket event listener when the component unmounts
      socket.off("codeUpdated");
      socket.off("userRole");
    };
  }, [role]);

  const handleCodeChange = (newCode) => {
    if (role === "editor") {
      console.log(role);
      // Emit the code update event to the server
      socket.emit("codeUpdate", newCode);
      setTypedCode(newCode);
    }
  };

  const handleCodeSolution = () => {
    const solutionCode = codeBlock.solution; // Assuming the solution is stored in the 'solution' key of the codeBlock object

    if (typedCode === solutionCode) {
      // Code matches the solution
      console.log("Code is correct!");
      setShowSmile(true); // Show the smile
      setTimeout(() => {
        setShowSmile(false); // Hide the smile after a delay
      }, 3000);
    } else {
      // Code does not match the solution
      console.log("Code is incorrect!");
    }
  };
  return (
    <div>
      <h1 className="header--codeblock"> {codeBlock.title}</h1>
      <CodeBlock
        isDisabled={role === "viewer"}
        code={codeBlock.code}
        onChange={handleCodeChange}
      />
      {role === "editor" && (
        <div className="button--submit-container">
          <button className="button--submit" onClick={handleCodeSolution}>
            Submit
          </button>
        </div>
      )}
      {showSmile && <div className="smile-overlay">😊</div>}
    </div>
  );
};

export default Page;
