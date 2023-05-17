import React from "react";
import { Routes, Route } from "react-router-dom";

import Lobby from "./pages/Lobby";
import ErrorPage from "./pages/ErrorPage";
import MainNavigation from "./components/Navigation/MainNavigation";
import Page from "./pages/Page";

const App = () => {
  return (
    <div>
      <MainNavigation />
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/page/:aid" element={<Page />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default App;
