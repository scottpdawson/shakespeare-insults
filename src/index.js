import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route component={App} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
