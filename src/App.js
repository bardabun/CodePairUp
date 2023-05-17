import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Lobby from "./pages/Lobby";
import MainNavigation from "./components/Navigation/MainNavigation";

const App = () => {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Route path="/" exact>
          <Lobby />
        </Route>
      </main>
    </Router>
  );
};

export default App;
