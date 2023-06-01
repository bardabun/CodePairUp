import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CodeBlock from "../components/UIElements/CodeBlock";
import { io } from "socket.io-client";

import "./page.css";

console.log("This is the NODE_ENV: xxxx" + process.env.NODE_ENV);
// Connect to the Socket.IO server
const serverURL =
  process.env.NODE_ENV === "development"
    ? "https://codepairup-server.up.railway.app"
    : "http://localhost:5000";

const socket = io(serverURL, {
  autoConnect: false,
});

// Main component for the page
const Page = () => {
  // State variables
  const [codeBlock, setCodeBlock] = useState({ id: "", title: "", code: "" });
  const [role, setRole] = useState(null);
  const [typedCode, setTypedCode] = useState("");
  const [showSmile, setShowSmile] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Extracting parameters from the URL
  let params = useParams();

  // Functions to open/close the solution popup
  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  // Fetch the codeBlock data from the server
  useEffect(() => {
    fetch(`${serverURL}/api/codeblocks/${params.aid}`)
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

  // Connect to the Socket.IO server and handle socket events
  useEffect(() => {
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

  useEffect(() => {
    // Cleanup function to disconnect the user
    const disconnectUser = () => {
      socket.disconnect();
    };

    // Call the disconnectUser function when the component unmounts
    return disconnectUser;
  }, []);

  // Handle code change by the editor and emit the code update event
  const handleCodeChange = (newCode) => {
    if (role === "editor") {
      socket.emit("codeUpdate", newCode);
      setTypedCode(newCode);
    }
  };
  // Handle code submission and compare with the solution
  const handleCodeSolution = () => {
    const solutionCode = codeBlock.solution;

    if (typedCode === solutionCode) {
      console.log("Code is correct!");
      setShowSmile(true);
      setTimeout(() => {
        setShowSmile(false); // Hide the smile after a delay
      }, 3000);
    } else {
      console.log("Code is incorrect!");
      setShowTryAgain(true);
      setTimeout(() => {
        setShowTryAgain(false);
      }, 3000);
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
      <div className="buttons--container">
        {role === "editor" && (
          <button className="button--submit" onClick={handleCodeSolution}>
            Submit
          </button>
        )}
        <button className="button--submit" onClick={openPopup}>
          Solution
        </button>
        {isOpen && (
          <div className="popup-overlay overlay">
            <CodeBlock isDisabled={true} code={codeBlock.solution} />
            <button className="button--submit" onClick={closePopup}>
              Close
            </button>
          </div>
        )}
      </div>
      {showSmile && <div className="smile-overlay overlay">😊</div>}
      {showTryAgain && (
        <div className="try-again">Incorrect, try again you can make it!</div>
      )}
    </div>
  );
};

export default Page;
