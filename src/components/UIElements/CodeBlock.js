import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyToClipboard from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faClipboard } from "@fortawesome/free-solid-svg-icons";

import "./CodeBlock.css";

const CodeBlock = (props) => {
  const [isCopied, setIsCopied] = useState(true);

  const isCopiedHandler = () => {
    setIsCopied((prevState) => !prevState);
  };

  return (
    <div className="code-block--container">
      <CopyToClipboard text={props.code} className="code-block--copy">
        <button className="code-block--copy-button" onClick={isCopiedHandler}>
          {isCopied ? (
            <FontAwesomeIcon icon={faCopy} />
          ) : (
            <FontAwesomeIcon icon={faClipboard} style={{ color: "#eee" }} />
          )}
        </button>
      </CopyToClipboard>
      <SyntaxHighlighter
        language="javascript"
        style={dark}
        customStyle={{ padding: "1rem" }}
        showLineNumbers="true"
        wrapLongLines={true}
      >
        {props.code}
      </SyntaxHighlighter>
    </div>
  );
};
export default CodeBlock;
