import React, { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faClipboard } from "@fortawesome/free-solid-svg-icons";

import "./CodeBlock.css";

// Component for displaying a code block with a Monaco Editor
const CodeBlock = (props) => {
  // State variables
  const [isCopied, setIsCopied] = useState(true);
  const [editableCode, setEditableCode] = useState(props.code);

  const isCopiedHandler = () => {
    setIsCopied((prevState) => !prevState);
  };

  // Update the editable code when the code prop changes
  useEffect(() => {
    setEditableCode(props.code);
  }, [props.code]);

  // Handle editor value change
  const handleEditorChange = (value) => {
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
          readOnly: props.isDisabled,
        }}
      />
    </div>
  );
};

export default CodeBlock;
