import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CodeBlock from "../components/UIElements/CodeBlock";

import "./Lobby.css";

const Page = (props) => {
  const [codeBlock, setCodeBlock] = useState({});
  let params = useParams();

  useEffect(() => {
    // Fetch the codeBlock data from the server
    // fetch("https://bardabun-server.vercel.app/api/product") //const res = await fetch(SERVER_URL + "/api/product");
    fetch(`http://localhost:5000/api/codeblocks/${params.aid}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data) {
          // Set the codeBlock data in the state
          setCodeBlock(data.codeBlock);
        } else {
          console.log("Couldn't find the article");
        }
      });
  }, [params.aid]);

  return (
    <div>
      <h1>Page {codeBlock.title}</h1>
      <CodeBlock code={codeBlock.code} />
    </div>
  );
};

export default Page;
