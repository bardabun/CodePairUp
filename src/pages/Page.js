import React from "react";
import { useParams } from "react-router-dom";
import CodeBlock from "../components/UIElements/CodeBlock";

import "./Lobby.css";

const Page = () => {
  let params = useParams();

  const codeSnippet = `function greet() {
    console.log("Hello, world!");
  }`;
  return (
    <div>
      <h1>Page {params.assignment}</h1>
      <CodeBlock code={codeSnippet} />
    </div>
  );
};

export default Page;
