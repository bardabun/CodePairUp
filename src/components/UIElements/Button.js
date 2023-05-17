import React from "react";
import { useNavigate } from "react-router-dom";

import "./Button.css";

const Button = (props) => {
  let navigate = useNavigate();

  return (
    <button
      className="button--big"
      onClick={() => {
        navigate(`/page/${props.codeBlockTitle}`);
      }}
    >
      Button {props.codeBlockTitle}
    </button>
  );
};

export default Button;
