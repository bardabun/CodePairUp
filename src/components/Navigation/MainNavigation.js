import React from "react";
import { useNavigate } from "react-router-dom";

import "./MainNavigation.css";

const MainNavigation = () => {
  let navigate = useNavigate();

  return (
    <header>
      <h1
        onClick={() => {
          navigate("/");
        }}
      >
        CodePairUp
      </h1>
    </header>
  );
};

export default MainNavigation;
