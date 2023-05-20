import React, { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faClipboard } from "@fortawesome/free-solid-svg-icons";

import "./CodeBlock.css";

const CodeBlock = (props) => {
  const [isCopied, setIsCopied] = useState(true);
  const [editableCode, setEditableCode] = useState(props.code);

  const isCopiedHandler = () => {
    setIsCopied((prevState) => !prevState);
  };

  useEffect(() => {
    setEditableCode(props.code);
  }, [props.code]);

  const handleEditorChange = (value, event) => {
    setEditableCode(value);
    props.onChange(value);
  };

  return (
    <div className="code-block--container">
      <CopyToClipboard text={editableCode} className="code-block--copy">
        <button className="code-block--copy-button" onClick={isCopiedHandler}>
          {isCopied ? (
            <FontAwesomeIcon icon={faCopy} />
          ) : (
            <FontAwesomeIcon icon={faClipboard} style={{ color: "#eee" }} />
          )}
        </button>
      </CopyToClipboard>
      <MonacoEditor
        language="javascript"
        theme="vs-dark"
        value={editableCode}
        onChange={handleEditorChange}
        options={{
          automaticLayout: true,
          fontSize: 18,
          wordWrap: "on",
        }}
      />
    </div>
  );
};

export default CodeBlock;
