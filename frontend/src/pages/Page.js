import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CodeBlock from "../components/UIElements/CodeBlock";
import { io } from "socket.io-client";

import "./page.css";

console.log("This is the ENV_NODE: " + process.env.NODE_ENV);
// Connect to the Socket.IO server
const serverURL =
  process.env.NODE_ENV === "production"
    ? "https://code-pair-up-server.vercel.app"
    : "http://localhost:5000";

// // Connect to the Socket.IO server
// let socket;
// if (process.env.NODE_ENV === "production") {
//   // Use the remote server address for production environment
//   console.log(process.env.NODE_ENV + " mode");
//   socket = io("https://code-pair-up-server.vercel.app", {
//     autoConnect: false,
//   });
// } else {
//   // Use the local machine address for development environment
//   console.log("not production mode");
//   socket = io("http://localhost:5000", { autoConnect: false });
// }

const socket = io(serverURL, {
  autoConnect: false,
});

const Page = () => {
  const [codeBlock, setCodeBlock] = useState({ id: "", title: "", code: "" });
  const [role, setRole] = useState(null);
  const [typedCode, setTypedCode] = useState("");
  const [showSmile, setShowSmile] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  let params = useParams();

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // Fetch the codeBlock data from the server
    // fetch("https://bardabun-server.vercel.app/api/product") //const res = await fetch(SERVER_URL + "/api/product");
    fetch(`${serverURL}/api/codeblocks/${params.aid}`)
      // fetch(`https://code-pair-up-client.vercel.app/api/codeblocks/${params.aid}`)
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
      setShowSmile(true);
      setTimeout(() => {
        setShowSmile(false); // Hide the smile after a delay
      }, 3000);
    } else {
      // Code does not match the solution
      console.log("Code is incorrect!");
      setShowTryAgain(true);
      setTimeout(() => {
        setShowTryAgain(false); // Hide the try again after a delay
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
            <CodeBlock
              isDisabled={true}
              code={codeBlock.solution}
              // onChange={handleCodeChange}
            />
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
